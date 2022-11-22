import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowingRelationshipsModule } from '../following-relationships/following-relationships.module';
import { PhotosModule } from '../photos/photos.module';
import { PostCommentsModule } from '../post-comments/post-comments.module';
import { PostLikeModule } from '../post-like/post-like.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntity]),
    PhotosModule,
    forwardRef(() => UsersModule),
    TagsModule,
    FollowingRelationshipsModule,
    forwardRef(() => PostLikeModule),
    forwardRef(() => PostCommentsModule),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule { }
