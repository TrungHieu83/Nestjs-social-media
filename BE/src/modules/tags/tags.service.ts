import { forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { PostsEntity } from '../posts/posts.entity';
import { UserEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { TagsDto } from './dto/tags.dto';
import { TagsEntity } from './tags.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagsEntity) private tagsRepo: Repository<TagsEntity>,
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        @Inject(forwardRef(() => NotificationsService)) private notificationService: NotificationsService
    ) { }

    async addTags(tags: [number], postEntity: PostsEntity, fromUser: UserEntity): Promise<any> {
        tags.forEach(async (tag) => {
            let tagEntity = new TagsEntity();
            tagEntity.user = await this.userService.findOne(tag);
            tagEntity.post = postEntity;
            try {
                await this.tagsRepo.save(tagEntity);
                await this.notificationService.tagNotification(fromUser, tagEntity.user);
            } catch (error) {
                throw new InternalServerErrorException(`Something blow up with our code ${error}`);
            }
        });
    }
}
