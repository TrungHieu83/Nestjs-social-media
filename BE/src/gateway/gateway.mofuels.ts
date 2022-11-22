import { Module } from "@nestjs/common";
import { ConversationReplyModule } from "src/modules/conversation-reply/conversation-reply.module";
import { ConversationsModule } from "src/modules/conversations/conversations.module";
import { FollowingRelationshipsModule } from "src/modules/following-relationships/following-relationships.module";
import { NotificationsModule } from "src/modules/notifications/notifications.module";
import { PostCommentsModule } from "src/modules/post-comments/post-comments.module";
import { PostLikeModule } from "src/modules/post-like/post-like.module";



@Module({
  imports: [NotificationsModule, FollowingRelationshipsModule, PostLikeModule, NotificationsModule, PostCommentsModule, ConversationsModule, ConversationReplyModule],
  providers: [],
  controllers: [],
})
export class GatewayModules { }