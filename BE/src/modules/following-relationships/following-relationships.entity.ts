import internal from "stream";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../users/users.entity";

@Entity()
export class FollowingRelationshipsEntity {

    @PrimaryGeneratedColumn()
    id: internal;

    @Column({ name: 'data_followed', type: 'date' })
    dateFollowed: Date;

    @ManyToOne(type => UserEntity, user => user.followedUser)
    followedUser: UserEntity;

    @ManyToOne(type => UserEntity, user => user.follower)
    follower: UserEntity;
}