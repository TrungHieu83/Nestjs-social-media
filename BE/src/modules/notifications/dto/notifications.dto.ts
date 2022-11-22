import { ApiProperty } from "@nestjs/swagger";
import { UserNotificationDto } from "src/modules/users/dto/user-notification.dto";
import { NotificationsEntity } from "../notifications.entity";


export class NotificationDto implements Readonly<NotificationDto> {

    @ApiProperty({ type: Number })
    id: number

    @ApiProperty({ type: String, description: 'notification content' })
    content: string

    @ApiProperty({ type: Date, description: 'created date' })
    createdDate: Date

    @ApiProperty({ type: Boolean, description: 'if it is read' })
    isRead: boolean

    @ApiProperty({ type: UserNotificationDto, description: 'information of sender' })
    fromUser: UserNotificationDto

    @ApiProperty({ type: UserNotificationDto, description: 'information of receiver'})
    toUser: UserNotificationDto

    public static from(dto: Partial<NotificationDto>){
        const result = new NotificationDto();
        result.id = dto.id;
        result.content = dto.content;
        result.createdDate = dto.createdDate;
        result.isRead = dto.isRead;
        result.fromUser = dto.fromUser;
        result.toUser = dto.toUser;
        return result;
    }

    public static fromEntity(entity: NotificationsEntity){
        return this.from({
            id: entity.id,
            content: entity.content,
            createdDate: entity.createdDate,
            isRead: entity.isRead,
            fromUser: UserNotificationDto.fromEntity(entity.fromUser),
            toUser: UserNotificationDto.fromEntity(entity.toUser)
        })
    }

}