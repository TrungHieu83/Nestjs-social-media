import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { UserEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { FollowDto } from './dto/follow.dto';
import { ListFollowDto } from './dto/list-following.dto';
import { FollowingRelationshipsEntity } from './following-relationships.entity';

@Injectable()
export class FollowingRelationshipsService {

    constructor(
        @InjectRepository(FollowingRelationshipsEntity) private repo: Repository<FollowingRelationshipsEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        @Inject(forwardRef(() => NotificationsService)) private notificationsService: NotificationsService
    ) { }

    async recommendNewUser(id: number): Promise<any> {
        const users = await this.userService.getNewUser();
        const result = [];
        for(let user of users){
            if(!await this.isFollowing(user.id, id) && user.id != id){
                const recommnedUser  = {
                    id: user.id,
                    fullName: user.fullName,
                    avatar: user.avatar,
                }
                result.push(recommnedUser);
            }
        }
        return result;
    }
    async getInfoFollowing(take: number, page: number, userId: number, loginUserId: number): Promise<any> {
        const takeQuery = take || 10;
        const pageQuery = page || 1;
        const skipQuery = (pageQuery - 1) * take;
        const listFollowing = await this.repo.createQueryBuilder('f')
            .innerJoinAndSelect('f.followedUser', 'user')
            .where('f.followerId = :userId', { userId: userId }).skip(skipQuery).take(takeQuery).getMany();
        const totalFollowing = await this.repo.createQueryBuilder()
            .select().where('followerId = :userId', { userId: userId }).getCount();
        const result = [];
        if (listFollowing.length == 0) {
            return result;
        }
        for (let following of listFollowing) {
            const listFollowingDto = new ListFollowDto();

            const isFollowing = await this.isFollowing(following.followedUser.id, loginUserId);
            listFollowingDto.user = { id: following.followedUser.id, fullName: following.followedUser.fullName, avatar: following.followedUser.avatar };
            listFollowingDto.isFollowing = isFollowing;
            result.push(listFollowingDto);
        }
        return this.paginateResponse(result, pageQuery, takeQuery, totalFollowing);
    }

    async getInfoFollower(take: number, page: number, userId: number, loginUserId: number): Promise<any> {
        const takeQuery = take || 10;
        const pageQuery = page || 1;
        const skipQuery = (pageQuery - 1) * take;
        const listFollower = await this.repo.createQueryBuilder('f')
            .innerJoinAndSelect('f.follower', 'user')
            .where('f.followedUserId = :userId', { userId: userId }).skip(skipQuery).take(takeQuery).getMany();
        const totalFollower = await this.repo.createQueryBuilder()
            .select().where('followedUserId = :userId', { userId: userId }).getCount();
        const result = [];
        if (listFollower.length == 0) {
            return result;
        }
        for (let follower of listFollower) {
            const listFollowerDto = new ListFollowDto();

            const isFollowing = await this.isFollowing(follower.follower.id, loginUserId);
            listFollowerDto.user = { id: follower.follower.id, fullName: follower.follower.fullName, avatar: follower.follower.avatar };
            listFollowerDto.isFollowing = isFollowing;
            result.push(listFollowerDto);
        }
        return this.paginateResponse(result, pageQuery, takeQuery, totalFollower);
    }
    async follow(followDto: FollowDto, userId: number): Promise<any> {
        const isExist = await this.repo.createQueryBuilder().select()
            .where("followedUserId = :followedUserId AND followerId = :followerId",
                { followedUserId: followDto.followedUserId, followerId: userId }).execute();
        if (isExist.length) {
            throw new BadRequestException(`Already followed user have id: ${followDto.followedUserId} `);
        }
        const entity = new FollowingRelationshipsEntity();
        entity.dateFollowed = new Date();
        entity.follower = await this.userService.findOne(userId);
        entity.followedUser = await this.userService.findOne(followDto.followedUserId);
        this.repo.save(entity);

        //create notification 
        return await this.notificationsService.followNotification(entity.follower, entity.followedUser);
    }

    async unfollow(followDto: FollowDto, userId: number): Promise<any> {
        await this.userService.findOne(userId);
        try {
            this.repo.createQueryBuilder().delete().where("followedUserId = :followedUserId AND followerId = :followerId",
                { followedUserId: followDto.followedUserId, followerId: userId }).execute();
        } catch (error) {
            throw new InternalServerErrorException(`Something blow up with our code`);
        }
        return {
            message: `Unfollowed user have id: ${followDto.followedUserId}`
        }
    }

    async getFollowedUser(userId: number): Promise<FollowDto[]> {
        const result = await this.repo.createQueryBuilder().select(['followedUserId']).where('followerId = :id', { id: userId }).execute();
        if (result.length == 0) {
            return [];
        }
        return result;
    }

    async getTotal(userId: number): Promise<any> {
        try {
            const totalFollowing = await this.repo.createQueryBuilder().select().where('followerId = :userId', { userId: userId }).getCount();
            const totalFollower = await this.repo.createQueryBuilder().select().where('followedUserId = :userId', { userId: userId }).getCount();
            return { totalFollowing: totalFollowing, totalFollower: totalFollower }
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async isFollowing(userId: number, loginUserId): Promise<boolean> {
        try {
            const isFollowing = await this.repo.createQueryBuilder().select()
                .where('followedUserId = :userId', { userId: userId })
                .andWhere('followerId = :loginUserId', { loginUserId: loginUserId }).getCount();
            if (isFollowing != 0) {
                return true;
            }
            return false;
        } catch (error) {
            throw new InternalServerErrorException(error);
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
