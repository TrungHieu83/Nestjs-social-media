import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikeModule } from '../post-like/post-like.module';
import { UsersModule } from '../users/users.module';
import { PhotosEntity } from './photos.entity';
import { PhotosService } from './photos.service';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([PhotosEntity])],
  providers: [PhotosService],
  exports: [PhotosService]
})
export class PhotosModule { }
