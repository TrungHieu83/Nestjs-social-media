import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { FollowingRelationshipsController } from './following-relationships.controller';
import { FollowingRelationshipsEntity } from './following-relationships.entity';
import { FollowingRelationshipsService } from './following-relationships.service';

@Module({
  imports: [TypeOrmModule.forFeature([FollowingRelationshipsEntity]), forwardRef(() => UsersModule), NotificationsModule],
  controllers: [FollowingRelationshipsController],
  providers: [FollowingRelationshipsService],
  exports: [FollowingRelationshipsService]
})
export class FollowingRelationshipsModule { }
