import { PrimaryColumn, Column, OneToMany,ManyToOne, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/modules/users/users.entity";
import { ConversationReplyEntity } from "src/modules/conversation-reply/conversation-reply.entity";

@Entity()
export class ConversationsEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column("datetime")
    createdDate : Date

    @ManyToOne(type=> UserEntity,user=>user.conversationsUser1)
    user1 : UserEntity

    @ManyToOne(type=> UserEntity,user=>user.conversationsUser2)
    user2 : UserEntity

    @OneToMany(type=> ConversationReplyEntity,conversationReply=>conversationReply.conversation)
    conversationReply: ConversationReplyEntity

}
