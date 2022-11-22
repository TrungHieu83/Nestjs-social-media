import { ApiProperty } from "@nestjs/swagger";
import { TagsDto } from "src/modules/tags/dto/tags.dto";


export class PostsDto implements Readonly<PostsDto>{

    @ApiProperty({ type: String })
    content: string

    @ApiProperty({ required: false, nullable: true })
    tags: [number];

}