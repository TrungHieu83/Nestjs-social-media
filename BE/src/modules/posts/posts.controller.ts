import { Body, Controller, Post, UploadedFiles, UseInterceptors, Request, DefaultValuePipe, ParseIntPipe, Query, Get, Param } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PostsDto } from './dto/posts.dto';
import { PostsEntity } from './posts.entity';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('posts') // /posts
export class PostsController {

    constructor(
        private postsService: PostsService,
    ) { }

    @Post('upload-photos/:postId')
    @ApiOperation({ summary: 'Upload photos of a post to firebase' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ schema: { example: { message: 'Images uploaded' } } })
    @ApiResponse({ status: 400, schema: { example: { status: 400, message: 'Format error: File fileName not an image', error: 'Bad request' } } })
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
        status: 404, description: 'Not found', schema: {
            example: {
                "statusCode": 404,
                "message": "Token not found",
                "error": "Not Found"
            }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            },
        },
    })
    @UseInterceptors(AnyFilesInterceptor())
    uploadPhotos(@UploadedFiles() files: Array<Express.Multer.File>, @Param('postId') postId: number) {
        return this.postsService.uploadPhotos(files, postId);
    }

    @Post('create-post')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a new post' })
    @ApiOkResponse({ schema: { example: { postId: "number" } } })
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
        status: 404, description: 'Not found', schema: {
            example: {
                "statusCode": 404,
                "message": "Token not found",
                "error": "Not Found"
            }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    createPost(@Body() postDto: PostsDto, @Request() req) {
        return this.postsService.createNewPost(postDto, req.headers.id);
    }

    @Get('get-posts')
    @ApiOperation({ summary: 'Get posts for homepage' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        schema: {
            example: {
                data: [
                    {
                        postId: "number",
                        content: "string",
                        createdDate: "datetime",
                        status: "number",
                        share: "number",
                        userId: "number",
                        fullName: "string",
                        avatar: "string",
                        photos: [{
                            id: "number",
                            url: "string"
                        }],
                        isLike: "boolean",
                        totalComments: "number",
                        totalLikes: "number"
                    }
                ],
                total: "number",
                currentPage: "number",
                nextPage: "number",
                prevPage: "number",
                lastPage: "number",
            }
        }
    })
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
        status: 404, description: 'Not found', schema: {
            example: { status: 404, message: 'Token not found', error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    getPosts(@Request() req, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,) {
        limit = limit > 20 ? 20 : limit;
        return this.postsService.paginate(limit, page, req.headers.id);

    }

    @Get('profile/get-posts')
    @ApiOperation({ summary: 'Get posts for profile page' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        schema: {
            example: {
                data: [
                    {
                        postId: "number",
                        content: "string",
                        createdDate: "datetime",
                        status: "number",
                        share: "number",
                        userId: "number",
                        fullName: "string",
                        avatar: "string",
                        photos: [{
                            id: "number",
                            url: "string"
                        }],
                        isLike: "boolean",
                        totalComments: "number",
                        totalLikes: "number"
                    }
                ],
                total: "number",
                currentPage: "number",
                nextPage: "number",
                prevPage: "number",
                lastPage: "number",
            }
        }
    })
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
        status: 404, description: 'Not found', schema: {
            example: { status: 404, message: 'Token not found', error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    getPostsForProfile(@Request() req, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Query('userId', ParseIntPipe) userId: number): Promise<Pagination<PostsEntity>> {
        limit = limit > 20 ? 20 : limit;
        return this.postsService.getPostsForProfile(limit, page, userId);

    }
}
