import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../users/users.module';
import { ConversationReplyController } from './conversation-reply.controller';
import { ConversationReplyEntity } from './conversation-reply.entity';
import { ConversationReplyService } from './conversation-reply.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ConversationReplyEntity]), forwardRef(() => ConversationsModule)],
  controllers: [ConversationReplyController],
  providers: [ConversationReplyService],
  exports: [ConversationReplyService]
})
export class ConversationReplyModule {}
