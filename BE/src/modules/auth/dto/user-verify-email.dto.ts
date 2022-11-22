import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"


export class UserVerifyEmailDto implements Readonly<UserVerifyEmailDto>{

    @ApiProperty({type: String})
    @IsString()
    @IsNotEmpty()
    verificationCode: string

    @ApiProperty({type: Number})
    @IsNotEmpty()
    @IsNumber()
    id: number
}