import { forwardRef, Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationReplyService } from '../conversation-reply/conversation-reply.service';
import { UsersService } from '../users/users.service';
import { ConversationsEntity } from './conversations.entity';
import { ConversationsDto } from './dto/conversations.dto';

@Injectable()
export class ConversationsService {


    constructor(
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        @Inject(forwardRef(() => ConversationReplyService)) private conversationReplyService: ConversationReplyService,
        @InjectRepository(ConversationsEntity) private conversationRepo: Repository<ConversationsEntity>,
    ) { }

    async getConversation(userId: number, loginUserId: number) {
        const ids = [userId, loginUserId];
        const isExist = await this.conversationRepo.createQueryBuilder('c').select(['c.id AS id']).where('c.user1Id IN (:...ids)', { ids: [userId, loginUserId] })
            .andWhere('c.user2Id IN (:...ids)', { ids: [userId, loginUserId] }).execute();
        if(isExist.length != 0){
            await this.conversationRepo.createQueryBuilder('c').update().set({createdDate: new Date()}).where('id = :id',{id: isExist[0]}).execute();
            return {conversationId: isExist[0].id}
        }
        const user1 = await this.userService.findOne(userId);
        const user2 = await this.userService.findOne(loginUserId);
        const conversationEntity = new ConversationsEntity();
        conversationEntity.createdDate = new Date();
        conversationEntity.user1 = user1;
        conversationEntity.user2 = user2;
        const result = await this.conversationRepo.save(conversationEntity);
        return {conversationId: conversationEntity.id};
    }

    async getConversations(take: number, page: number, userId: number): Promise<any> {
        const takeQuery = take || 10;
        const pageQuery = page || 1;
        const skipQuery = (pageQuery - 1) * take;
        await this.userService.findOne(userId);
        const allConversations = await this.conversationRepo.createQueryBuilder('c').where('c.user1Id = :id', { id: userId })
            .orWhere('c.user2Id = :id', { id: userId }).execute();
        const listConversations = await this.conversationRepo.createQueryBuilder('c')
            .innerJoinAndSelect('c.user1', 'user1')
            .innerJoinAndSelect('c.user2', 'user2')
            .where('c.user1Id = :id', { id: userId })
            .orWhere('c.user2Id = :id', { id: userId }).orderBy('c.createdDate','DESC').skip(skipQuery).take(takeQuery).getMany();
        const result = [];
        for (let conversation of listConversations) {
            const conversationDto = new ConversationsDto();
            const lastReply = await this.conversationReplyService.getLastReply(conversation.id);
            conversationDto.id = conversation.id;
            conversationDto.lastReply = lastReply;
            if (userId != conversation.user1.id) {
                const user = await this.userService.findOne(conversation.user1.id);
                conversationDto.user = { id: user.id, fullName: user.fullName, avatar: user.avatar };
            } else if (userId != conversation.user2.id) {
                const user = await this.userService.findOne(conversation.user2.id);
                conversationDto.user = { id: user.id, fullName: user.fullName, avatar: user.avatar };
            }
            result.push(conversationDto);
        }
        return this.paginateResponse(result, pageQuery, takeQuery, allConversations.length);
    }

    async deleteConversation(conversationId: number) {
        await this.findById(conversationId);
        const result = await this.conversationReplyService.deleteMessages(conversationId);
        if (!result) {
            throw new InternalServerErrorException('Something blow up with our code')
        }
        try {
            await this.conversationRepo.createQueryBuilder().delete().where('id = :id', { id: conversationId }).execute();
            return { message: `Conversation have id-${conversationId} is deleted` };
        } catch (error) {
            throw new InternalServerErrorException('Something blow up with our code')
        }
    }

    async findById(conversationId: number): Promise<ConversationsEntity> {
        const result = await this.conversationRepo.findOne(conversationId);
        if (!result) {
            throw new NotFoundException(`Conversation have id-${conversationId} does not exist`);
        }
        return result;
    }
    paginateResponse(data: any, page: number, limit: number, total: number) {
        const lastPage = Math.ceil(total / limit);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;
        return {
            data: [...data],
            total: total,
            currentPage: page,
            nextPage: nextPage,
            prevPage: prevPage,
            lastPage: lastPage,
        }
    }
}
