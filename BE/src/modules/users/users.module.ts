import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './users.entity';
import { MailModule } from '../mail/mail.module';
import { FollowingRelationshipsModule } from '../following-relationships/following-relationships.module';
import { PostsModule } from '../posts/posts.module';
import { PhotosModule } from '../photos/photos.module';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),MailModule, forwardRef(() => FollowingRelationshipsModule), forwardRef(() => PostsModule), forwardRef(() => PhotosModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
