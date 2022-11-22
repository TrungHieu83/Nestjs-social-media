import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { ConversationsModule } from '../conversations/conversations.module';
import { ConversationsService } from '../conversations/conversations.service';
import { UsersService } from '../users/users.service';
import { ConversationReplyEntity } from './conversation-reply.entity';
import { ConversationReplyDto } from './dto/conversation-reply.dto';

@Injectable()
export class ConversationReplyService {

    constructor(
        @InjectRepository(ConversationReplyEntity) private conversationReplyRepo: Repository<ConversationReplyEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        @Inject(forwardRef(() => ConversationsService)) private conversationService: ConversationsService
    ) { }

    async getLastReply(conversationId: number): Promise<ConversationReplyDto> {
        const lastReply = await this.conversationReplyRepo.createQueryBuilder('c')
            .select(['c.id AS id', 'c.text AS text', 'c.createdDate AS createdDate', 'c.userId AS userId', 'c.isRead AS isRead'])
            .where('c.conversationId = :id', { id: conversationId })
            .orderBy('c.createdDate', 'DESC')
            .take(1)
            .execute();
        if(lastReply.length == 0){
            return null;
        }
        const user = await this.userService.findOne(lastReply[0].userId);
        const conversationReplyDto = new ConversationReplyDto();
        conversationReplyDto.id = lastReply[0].id;
        conversationReplyDto.text = lastReply[0].text;
        conversationReplyDto.createdDate = lastReply[0].createdDate;
        conversationReplyDto.isRead = lastReply[0].isRead;
        conversationReplyDto.conversationId = conversationId;
        conversationReplyDto.userReply = { id: user.id, fullName: user.fullName, avatar: user.avatar };
        return conversationReplyDto;
    }

    async addMessage(conversationId: number, text: string, receiverId: number): Promise<any> {
        const conversationReplyEntity = new ConversationReplyEntity();
        conversationReplyEntity.conversation = await this.conversationService.findById(conversationId);
        conversationReplyEntity.createdDate = new Date();
        const userEntity = await this.userService.findOne(receiverId);
        conversationReplyEntity.user = userEntity;
        conversationReplyEntity.text = text;
        conversationReplyEntity.isRead = false;
        const result = await this.conversationReplyRepo.save(conversationReplyEntity);
        return {
            id: result.id,
            text: result.text,
            createdDate: result.createdDate,
            isRead: result.isRead,
            conversationId: conversationId,
            userReply: {
                id: userEntity.id,
                fullName: userEntity.fullName,
                avatar: userEntity.avatar
            }
        }
    }

    async getMessages(take: number, page: number,conversationId: number): Promise<any> {
        const takeQuery = take || 10;
        const pageQuery = page || 1;
        const skipQuery = (pageQuery - 1) * take;
        await this.conversationService.findById(conversationId);
        const messages = await this.conversationReplyRepo.createQueryBuilder('c')
            .innerJoinAndSelect('c.user','user')
            .where('c.conversationId = :id', { id: conversationId })
            .orderBy('c.createdDate', 'DESC')
            .skip(skipQuery).take(20).getMany();
        const allMessages = await this.conversationReplyRepo.createQueryBuilder('c').where('c.conversationId = :id', { id: conversationId }).getCount();
        const result = [];
        for (let message of messages) {
            const conversationReplyDto = new ConversationReplyDto();
            conversationReplyDto.id = message.id;
            conversationReplyDto.text = message.text;
            conversationReplyDto.createdDate = message.createdDate;
            conversationReplyDto.isRead = message.isRead;
            conversationReplyDto.conversationId = conversationId;
            conversationReplyDto.userReply = { id: message.user.id, fullName: message.user.fullName, avatar: message.user.avatar };
            result.push(conversationReplyDto);
        }
        return this.paginateResponse(result.reverse(), pageQuery, takeQuery, allMessages);
    }

    async deleteMessages(conversationId: number): Promise<boolean> {
        try {
            await this.conversationReplyRepo.createQueryBuilder().delete().where('conversationId = :id', { id: conversationId }).execute();
            return true;
        } catch (error) {
            return false
        }
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
