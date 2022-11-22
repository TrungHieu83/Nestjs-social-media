import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { NotificationDto } from './dto/notifications.dto';
import { NotificationsEntity } from './notifications.entity';
import { NotificationTemplate } from './template/notifications.template';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectRepository(NotificationsEntity) private notificationRepo: Repository<NotificationsEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    ) { }

    async followNotification(fromUser: UserEntity, toUser: UserEntity): Promise<any> {
        const result = await this.notificationRepo.save(this.newNotificationEntity(fromUser, toUser, NotificationTemplate.followedByOtherUsers(fromUser)));
        const notification = {
            id: result.id,
            content: result.content,
            createdDate: result.createdDate,
            isRead: result.isRead,
            userId: result.fromUser.id,
            fullName: result.fromUser.fullName,
            avatar: result.fromUser.avatar
        }
        return notification;
    }

    async tagNotification(fromUser: UserEntity, toUser: UserEntity): Promise<NotificationDto> {
        return this.notificationRepo.save(this.newNotificationEntity(fromUser, toUser, NotificationTemplate.tagNotificationTemplate(fromUser)));

    }

    async commentNotification(fromUser: UserEntity, toUser: UserEntity): Promise<any> {
        const result = await this.notificationRepo.save(this.newNotificationEntity(fromUser, toUser, NotificationTemplate.commentNotificationTemplate(fromUser)));
        const notification = {
            id: result.id,
            content: result.content,
            createdDate: result.createdDate,
            isRead: result.isRead,
            userId: result.fromUser.id,
            fullName: result.fromUser.fullName,
            avatar: result.fromUser.avatar
        }
        return notification;
    }

    async likeNotification(fromUserId: number, toUserId: number): Promise<any> {
        const fromUser = await this.userService.findOne(fromUserId);
        const toUser = await this.userService.findOne(toUserId);
        const result = await this.notificationRepo.save(this.newNotificationEntity(fromUser, toUser, NotificationTemplate.likeNotificationTemplate(fromUser)));
        const notification = {
            id: result.id,
            content: result.content,
            createdDate: result.createdDate,
            isRead: result.isRead,
            userId: result.fromUser.id,
            fullName: result.fromUser.fullName,
            avatar: result.fromUser.avatar
        }

        return notification;
    }

    async getTop5(toUserId: number): Promise<any> {
        try {
            const result = await this.notificationRepo.createQueryBuilder('n')
                .innerJoinAndSelect('n.fromUser', 'u')
                .select(['n.id AS id',
                    'n.is_read AS isRead',
                    'n.content AS content',
                    'n.created_date AS createdDate',
                    'u.id AS userId',
                    'u.fullName AS fullName',
                    'u.avatar AS avatar'])
                .where('n.toUserId = :id', { id: toUserId })
                .orderBy('created_date', 'DESC')
                .limit(10).execute();

            return result;
        } catch (error) {
            throw new InternalServerErrorException('Something blow up with our code');
        }
    }

    private newNotificationEntity(fromUser: UserEntity, toUser: UserEntity, template: string): NotificationsEntity {
        const notificationEntity = new NotificationsEntity();
        notificationEntity.content = template;
        notificationEntity.isRead = false;
        notificationEntity.createdDate = new Date();
        notificationEntity.fromUser = fromUser;
        notificationEntity.toUser = toUser;
        return notificationEntity;
    }

    paginateResponse(data: any, page: number, limit: number) {
        const total = data.length + 1;
        const lastPage = Math.ceil(total / limit);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;
        return {
            statusCode: 'success',
            data: [...data],
            count: total,
            currentPage: page,
            nextPage: nextPage,
            prevPage: prevPage,
            lastPage: lastPage,
        }
    }

}
