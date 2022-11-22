import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostCommentsService } from './post-comments.service';

@ApiTags('Post comments')
@Controller('post-comments')
export class PostCommentsController {

    constructor(
        private postCommentService: PostCommentsService
    ) { }


    @Get('get-comment')
    @ApiOperation({ summary: 'Get comments of a post' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        schema: {
            example: {
                data: [{
                    id: 'number',
                    content: 'string',
                    createdDate: 'datetime',
                    user: {
                        userId: 'number',
                        fullName: 'string',
                        avatar: 'string',
                    },
                    replyComment: [{
                        id: 'number',
                        content: 'string',
                        createdDate: 'datetime',
                        user: {
                            userId: 'number',
                            fullName: 'string',
                            avatar: 'string',
                        },
                    }]

                }],
                total: "number",
                currentPage: "number",
                nextPage: "number",
                prevPage: "number",
                lastPage: "number",
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad request', schema: { example: { status: 400, message: 'Post have id-postId does not exist', error: 'Bad request' } } })
    @ApiResponse({
        status: 401, description: 'Unauthorized', schema: {
            example: {
                "statusCode": 401,
                "message": "Token is invalid",
                "error": "Unauthorized"
            }
        }
    })
    @ApiResponse({
        status: 404, schema: {
            example: { status: 404, message: 'Token not found', error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    getComment(@Query('postId') postId: number, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10): Promise<any> {
        return this.postCommentService.getComments(limit, page, postId);
    }


}
