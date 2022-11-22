import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class RefreshToken{
    @ApiProperty({type:String,description:'refresh token'})
    @IsNotEmpty()
    @IsString()
    refreshToken : string
}