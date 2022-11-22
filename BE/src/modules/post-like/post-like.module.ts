import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { PostLikeController } from './post-like.controller';
import { PostLikeEntity } from './post-like.entity';
import { PostLikeService } from './post-like.service';

@Module({
  imports: [forwardRef(() => PostsModule), forwardRef(() => UsersModule), TypeOrmModule.forFeature([PostLikeEntity]), NotificationsModule],
  controllers: [PostLikeController],
  providers: [PostLikeService],
  exports: [PostLikeService]
})
export class PostLikeModule { }
