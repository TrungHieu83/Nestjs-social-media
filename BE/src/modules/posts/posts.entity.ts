import { PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Entity } from "typeorm";
import { UserEntity } from "src/modules/users/users.entity";
import { PostCommentsEntity } from "src/modules/post-comments/post-comments.entity";
import { PostLikeEntity } from "src/modules/post-like/post-like.entity";
import { PhotosEntity } from "../photos/photos.entity";
import { TagsEntity } from "../tags/tags.entity";

@Entity()
export class PostsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'nvarchar' })
    content: string;

    @Column({ type: 'int' })
    status: number;

    @Column({ type: 'datetime' })
    createdDate: Date;

    @Column({ type: 'int', nullable: true })
    share: number;

    @ManyToOne(type => UserEntity, user => user.posts)
    user: UserEntity;

    @OneToMany(type => PostCommentsEntity, postcomment => postcomment.post)
    postComments: PostCommentsEntity;

    @OneToMany(type => PostLikeEntity, postLike => postLike.post)
    postLikes: PostLikeEntity;

    @OneToMany(type => PhotosEntity, photo => photo.post)
    photos: PhotosEntity;

    @OneToMany(type => TagsEntity, tag => tag.post)
    tags: TagsEntity[];

}
