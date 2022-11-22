import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { PostCommentsDto, ReplyCommentDto } from './dto/post-comments.dto';
import { PostCommentsEntity } from './post-comments.entity';

@Injectable()
export class PostCommentsService {

    constructor(
        @InjectRepository(PostCommentsEntity) private postCommentRepo: Repository<PostCommentsEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        @Inject(forwardRef(() => PostsService)) private postService: PostsService,
        @Inject(forwardRef(() => NotificationsService)) private notificationService: NotificationsService,
    ) { }

    async addComment(fromUserId: number, toUserId: number, postId: number, comment: string, replyForComment: number): Promise<any> {
        try {    
            const fromUser = await this.userService.findOne(fromUserId);
            const toUser = await this.userService.findOne(toUserId);
            const post = await this.postService.findOne(postId);
            const commentEntity = new PostCommentsEntity();
            commentEntity.content = comment;
            commentEntity.createdDate = new Date();
            commentEntity.user = fromUser;
            commentEntity.post = post;
            commentEntity.replyForComment = replyForComment;
            const result = await this.postCommentRepo.save(commentEntity);
            if (fromUserId != toUserId) {
                const notification = await this.notificationService.commentNotification(fromUser, toUser);
                return {
                    comment: {
                        id: result.id,
                        content: result.content,
                        createdDate: result.createdDate,
                        replyForComment: replyForComment,
                        userId: fromUser.id,
                        fullName: fromUser.fullName,
                        avatar: fromUser.avatar
                    },
                    notification: notification
                }
            }
        } catch (error) {
            return { error: error }
        }
    }

    async getComments(take: number, page: number, postId: number): Promise<any> {
        const takeQuery = take || 10;
        const pageQuery = page || 1;
        const skipQuery = (pageQuery - 1) * take;
        await this.postService.findOne(postId);
        const allComment = await this.postCommentRepo.createQueryBuilder('c').select().where('c.postId = :postId', { postId: postId })
            .andWhere('c.reply_for_comment IS NULL').execute();
        const paginatedComment = await this.postCommentRepo.createQueryBuilder('c')
            .innerJoinAndSelect('c.user', 'userInfo')
            .where('c.postId = :postId', { postId: postId })
            .andWhere('c.reply_for_comment IS NULL')
            .orderBy('c.createdDate', 'DESC').skip(skipQuery).take(takeQuery)
            .getMany();
        if (allComment.length == 0) {
            return {
                data: [],
            };
        }
        const result = [];
        for (const comment of paginatedComment) {
            const commentAndReplyComment = new PostCommentsDto();
            const replyComments = await this.postCommentRepo.createQueryBuilder('c')
                .innerJoinAndSelect('c.user', 'userInfo')
                .select([
                    'c.id AS id',
                    'c.content AS content',
                    'c.createdDate AS createdDate',
                    'userInfo.id AS userId',
                    'userInfo.fullName AS fullName',
                    'userInfo.avatar AS avatar'
                ])
                .andWhere('c.reply_for_comment = :id', { id: comment.id })
                .execute();

            const replyCommentsDto = replyComments.map((rc) => {
                const result = new ReplyCommentDto();
                result.id = rc.id;
                result.content = rc.content;
                result.createdDate = rc.createdDate;
                result.user = { userId: rc.userId, fullName: rc.fullName, avatar: rc.avatar }
                return result;
            });

            commentAndReplyComment.id = comment.id;
            commentAndReplyComment.content = comment.content;
            commentAndReplyComment.createdDate = comment.createdDate;
            commentAndReplyComment.user = { userId: comment.user.id, fullName: comment.user.fullName, avatar: comment.user.avatar }
            commentAndReplyComment.replyComment = replyCommentsDto;
            result.push(commentAndReplyComment)
        }

        return this.paginateResponse(result, pageQuery, takeQuery, allComment.length + 1);
    }
    async getNumberComments(postId: number): Promise<number> {
        const result = await this.postCommentRepo.createQueryBuilder().select().where('postId = :postId', { postId: postId }).getCount();
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
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
