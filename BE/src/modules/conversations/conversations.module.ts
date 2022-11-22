import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationReplyModule } from '../conversation-reply/conversation-reply.module';
import { ConversationReplyService } from '../conversation-reply/conversation-reply.service';
import { UsersModule } from '../users/users.module';
import { ConversationsController } from './conversations.controller';
import { ConversationsEntity } from './conversations.entity';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [UsersModule, forwardRef(() => ConversationReplyModule), TypeOrmModule.forFeature([ConversationsEntity])],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService]
})
export class ConversationsModule {}
