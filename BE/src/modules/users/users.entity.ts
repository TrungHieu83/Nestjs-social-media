import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { NotificationsEntity } from "src/modules/notifications/notifications.entity";
import { PhotosEntity } from "src/modules/photos/photos.entity";
import { ConversationsEntity } from "src/modules/conversations/conversations.entity";
import { ConversationReplyEntity } from "src/modules/conversation-reply/conversation-reply.entity";
import { PostsEntity } from "src/modules/posts/posts.entity";
import { PostLikeEntity } from "src/modules/post-like/post-like.entity";
import { PostCommentsEntity } from "src/modules/post-comments/post-comments.entity";
import { FollowingRelationshipsEntity } from "../following-relationships/following-relationships.entity";
import { TagsEntity } from "../tags/tags.entity";
@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "bigint", nullable: true })
    facebookId: number;

    @Column({ type: "varchar", nullable: true })
    password: string

    @Column({ type: "varchar", length: 50, nullable: true })
    email: string

    @Column({ type: "varchar", nullable: true })
    fullName: string

    @Column({ type: 'date', nullable: true })
    dob: Date

    @Column({ type: "int", nullable: true })
    accountStatus: number

    @Column({ type: "varchar", nullable: true })
    verificationCode: string

    @Column({ type: "boolean", nullable: true })
    gender: boolean

    @Column({ type: "varchar", nullable: true })
    address: string

    @Column({ type: "varchar", length: 12, nullable: true })
    phone: string

    @Column({ name: "is_enable", nullable: false })
    isEnable: boolean

    @Column({ type: "varchar", nullable: true })
    avatar: string

    @Column({ name: "cover_img", type: "varchar", nullable: true })
    coverImg: string;

    @Column({type:'datetime', nullable: true})
    createdDate: Date;

    @OneToMany(type => NotificationsEntity, notifications => notifications.toUser)
    toUser: NotificationsEntity[];

    @OneToMany(type => NotificationsEntity, notifications => notifications.fromUser)
    fromUser: NotificationsEntity[];

    @OneToMany(type => ConversationsEntity, conversation => conversation.user1)
    conversationsUser1: ConversationsEntity[];

    @OneToMany(type => ConversationsEntity, conversation => conversation.user2)
    conversationsUser2: ConversationsEntity[];

    @OneToMany(type => ConversationReplyEntity, conversationReply => conversationReply.user)
    conversationReply: ConversationReplyEntity[];

    @OneToMany(type => PostsEntity, post => post.user)
    posts: PostsEntity[];

    @OneToMany(type => PostLikeEntity, postLike => postLike.user)
    postLikes: PostLikeEntity[];

    @OneToMany(type => PostCommentsEntity, postComment => postComment.user)
    postComments: PostCommentsEntity[];

    @OneToMany(type => FollowingRelationshipsEntity, follow => follow.followedUser)
    followedUser: FollowingRelationshipsEntity[];

    @OneToMany(type => FollowingRelationshipsEntity, following => following.follower)
    follower: FollowingRelationshipsEntity[];

    @OneToMany(type => TagsEntity, tag => tag.user)
    tags: TagsEntity[];

}
