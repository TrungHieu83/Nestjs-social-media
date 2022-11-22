import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";
import { PostsEntity } from "src/modules/posts/posts.entity";
import { UserEntity } from "src/modules/users/users.entity";

@Entity()
export class PostLikeEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'datetime' })
    createdDate: Date

    @ManyToOne(type => PostsEntity, post => post.postLikes)
    post: PostsEntity

    @ManyToOne(type => UserEntity, user => user.postLikes)
    user: UserEntity


}
