import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostsEntity } from "../posts/posts.entity";
import { UserEntity } from "../users/users.entity";

@Entity()
export class TagsEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => PostsEntity, post => post.tags)
    post: PostsEntity;

    @ManyToOne(type => UserEntity, user => user.tags)
    user: UserEntity;
}