import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";
import { UserEntity } from "src/modules/users/users.entity";
import { ConversationsEntity } from "src/modules/conversations/conversations.entity";

@Entity()
export class ConversationReplyEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'nvarchar' })
    text: string

    @Column({ type: 'boolean' })
    isRead: boolean;

    @Column({ type: 'datetime' })
    createdDate: Date;

    @ManyToOne(type => ConversationsEntity, conversation => conversation.conversationReply)
    conversation: ConversationsEntity

    @ManyToOne(type => UserEntity, user => user.conversationReply)
    user: UserEntity
}
