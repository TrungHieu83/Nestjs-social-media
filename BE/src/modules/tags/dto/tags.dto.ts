import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";


export class TagsDto implements Readonly<TagsDto>{

    @IsNumber()
    @ApiProperty({ type: Number })
    userId: number;

}