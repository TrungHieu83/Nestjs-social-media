import { UserEntity } from "src/modules/users/users.entity";
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";
import { PostsEntity } from "../posts/posts.entity";

@Entity()
export class PhotosEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'photo_name', type: 'varchar', nullable: true })
    photoName: string

    @ManyToOne(type => PostsEntity, post => post.photos)
    post: PostsEntity


}
