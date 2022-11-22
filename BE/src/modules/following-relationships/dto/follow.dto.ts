import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";


export class FollowDto{

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({type: Number, description: 'Followed user id'})
    followedUserId: number;

}