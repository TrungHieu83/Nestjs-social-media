import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"




export class ResetPasswordDto implements Readonly<ResetPasswordDto>{

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({type:'string',description:'email'})
    email : string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({type:'string',description:'password'})
    newPassword : string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({type:'string',description:'security code'})
    securityCode : string
}