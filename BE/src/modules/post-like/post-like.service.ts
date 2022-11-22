import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { PostLikeEntity } from './post-like.entity';

@Injectable()
export class PostLikeService {
    constructor(
        @Inject(forwardRef(() => PostsService)) private postService: PostsService,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        @InjectRepository(PostLikeEntity) private postLikeRepo: Repository<PostLikeEntity>,
        @Inject(forwardRef(() => NotificationsService)) private notificationService: NotificationsService,
    ) { }

    async addLike(postId: number, fromUserId: number, toUserId: number): Promise<any> {
        const isLike = await this.isLike(postId, fromUserId);
        if (isLike) {
            await this.postLikeRepo.createQueryBuilder().delete().where('postId = :postId', { postId: postId }).andWhere('userId = :id', { id: fromUserId }).execute();
            return null;
        } else {
            const fromUser = await this.userService.findOne(fromUserId);
            const post = await this.postService.findOne(postId);
            const postLikeEntity = new PostLikeEntity();
            postLikeEntity.createdDate = new Date();
            postLikeEntity.post = post;
            postLikeEntity.user = fromUser;
            const result = await this.postLikeRepo.save(postLikeEntity);
            if (fromUserId != toUserId) {
                return await this.notificationService.likeNotification(fromUserId, toUserId);
            }else{
                return null;
            }
        }
    }

    async isLike(postId: number, userId: number): Promise<boolean> {
        const isLike = await this.postLikeRepo.createQueryBuilder().select()
            .where('postId = :postId', { postId: postId })
            .andWhere('userId = :userId', { userId: userId }).execute();
        if (isLike.length == 0) {
            return false;
        }
        return true;
    }
    async getNumberLikes(postId: number): Promise<number> {
        const result = await this.postLikeRepo.createQueryBuilder().select().where('postId = :postId', { postId: postId }).getCount();
        return result;
    }
}
