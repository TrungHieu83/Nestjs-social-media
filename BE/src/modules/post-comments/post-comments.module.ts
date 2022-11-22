import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { PostCommentsController } from './post-comments.controller';
import { PostCommentsEntity } from './post-comments.entity';
import { PostCommentsService } from './post-comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostCommentsEntity]), forwardRef(() => UsersModule), NotificationsModule, forwardRef(() => PostsModule)],
  controllers: [PostCommentsController],
  providers: [PostCommentsService],
  exports: [PostCommentsService]
})
export class PostCommentsModule {}
