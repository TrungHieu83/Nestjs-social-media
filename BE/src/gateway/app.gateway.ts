import { forwardRef, Inject, Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { ConversationReplyService } from "src/modules/conversation-reply/conversation-reply.service";
import { ConversationsService } from "src/modules/conversations/conversations.service";
import { FollowingRelationshipsService } from "src/modules/following-relationships/following-relationships.service";
import { PostCommentsService } from "src/modules/post-comments/post-comments.service";
import { PostLikeService } from "src/modules/post-like/post-like.service";
import { NotificationInterface } from "./interfaces/notification.interface";
import { SendMessageInterface } from "./interfaces/send-message.interface";


@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @Inject(forwardRef(() => FollowingRelationshipsService)) private followService: FollowingRelationshipsService,
        @Inject(forwardRef(() => PostLikeService)) private postLikeService: PostLikeService,
        @Inject(forwardRef(() => PostCommentsService)) private postCommentService: PostCommentsService,
        @Inject(forwardRef(() => ConversationsService)) private conversationService: ConversationsService,
        @Inject(forwardRef(() => ConversationReplyService)) private conversationReplyService: ConversationReplyService

    ) { }
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('MessageGateway');

    handleConnection(client: any, ...args: any[]) {
        this.logger.log(client.id, 'Connected');
    }
    handleDisconnect(client: any) {
        this.logger.log(client.id, 'Disconnect');
    }
    afterInit(server: any) {
        this.logger.log(server, 'Init');
    }

    @SubscribeMessage('notification')
    async notification(client: Socket, payload: NotificationInterface) {
        if (payload.type === 1) { //follow
            const followNotification = await this.followService.follow({ followedUserId: payload.toUserId }, payload.fromUserId);
            this.server.emit(`notification-${payload.toUserId}`, followNotification);

        } else if (payload.type === 2) { //like
            const isLike = await this.postLikeService.addLike(payload.postId, payload.fromUserId, payload.toUserId);
            const totalLikes = await this.postLikeService.getNumberLikes(payload.postId);
            console.log(totalLikes);
            if (isLike != null) {
                this.server.emit(`notification-${payload.toUserId}`, isLike);
            }
            this.server.emit(`post-total-like-${payload.postId}`, { totalLikes: totalLikes });

        } else if (payload.type === 3) { //comment          
            const res = await this.postCommentService.addComment(payload.fromUserId, payload.toUserId, payload.postId, payload.comment, payload.replyForComment);
            console.log(res)
            const totalComments = await this.postCommentService.getNumberComments(payload.postId);
            if (payload.fromUserId !== payload.toUserId) {
                this.server.emit(`notification-${payload.toUserId}`, res.notification);
            }
            
            this.server.emit(`post-${payload.postId}`, res.comment);
            this.server.emit(`post-total-comment-${payload.postId}`, { totalComments: totalComments });


        }
    }

    @SubscribeMessage('sendMessage')
    async sendMessage(client: Socket, payload: SendMessageInterface) {
        const result = await this.conversationReplyService.addMessage(payload.conversationId, payload.text, payload.receiverId);
        this.server.emit(`message-${payload.conversationId}-${payload.receiverId}`, result);
        this.server.emit(`message-${payload.receiverId}`, { conversationId: payload.conversationId });
    }
}