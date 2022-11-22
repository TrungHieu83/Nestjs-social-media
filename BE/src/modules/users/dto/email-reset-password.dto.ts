import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class UserEmailDto{

    @ApiProperty({type: String})
    @IsEmail()
    @IsNotEmpty()
    email: string;
}