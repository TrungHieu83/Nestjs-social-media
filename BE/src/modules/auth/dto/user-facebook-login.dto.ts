import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class FacebookLoginDto implements Readonly<FacebookLoginDto>{

    @ApiProperty({type: Number, description: "facebook userId"})
    @IsNotEmpty()
    id: number;

    @ApiProperty({type: String})
    @IsNotEmpty()
    @IsString()
    fullName: string;
}