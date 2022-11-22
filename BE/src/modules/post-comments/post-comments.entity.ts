import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/modules/users/users.entity";
import { PostsEntity } from "src/modules/posts/posts.entity";

@Entity()
export class PostCommentsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'nvarchar' })
    content: string

    @Column({ type: 'datetime' })
    createdDate: Date

    @Column({ name: 'reply_for_comment', type: 'int', nullable: true })
    replyForComment: number;

    @ManyToOne(type => PostsEntity, post => post.postComments)
    post: PostsEntity

    @ManyToOne(type => UserEntity, user => user.postComments)
    user: UserEntity

}
