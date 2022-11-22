import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { TagsController } from './tags.controller';
import { TagsEntity } from './tags.entity';
import { TagsService } from './tags.service';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([TagsEntity]), NotificationsModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService]
})
export class TagsModule { }
