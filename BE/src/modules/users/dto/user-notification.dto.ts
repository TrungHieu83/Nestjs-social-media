import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { UserEntity } from "../users.entity";


export class UserNotificationDto implements Readonly<UserNotificationDto>{

    @ApiProperty({ type: Number })
    id: number

    @ApiProperty({ type: 'string', description: 'email' })
    email: string

    @ApiProperty({ type: String, description: 'full name' })
    fullName: string

    @ApiProperty({ type: String, description: 'avatar' })
    avatar: string

    public static from(dto: Partial<UserNotificationDto>) {
        const result = new UserNotificationDto();
        result.id = dto.id;
        result.email = dto.email;
        result.fullName = dto.fullName;
        result.avatar = dto.avatar;
        return result;
    }
    public static fromEntity(entity: UserEntity) {
        return this.from({
            id: entity.id,
            email: entity.email,
            fullName: entity.fullName,
            avatar: entity.avatar
        })
    }
}