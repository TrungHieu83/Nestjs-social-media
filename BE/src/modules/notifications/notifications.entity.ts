import { UserEntity } from "src/modules/users/users.entity";
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from "typeorm";


@Entity()
export class NotificationsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'nvarchar' })
    content: string

    @Column({ name: 'created_date', type: "datetime" })
    createdDate: Date

    @Column({ name: 'is_read', type: 'boolean' })
    isRead: boolean

    @ManyToOne(type => UserEntity, user => user.toUser)
    toUser: UserEntity;

    @ManyToOne(type => UserEntity, user => user.fromUser)
    fromUser: UserEntity;
}
