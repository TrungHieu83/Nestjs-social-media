import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FollowDto } from './dto/follow.dto';
import { ListFollowDto } from './dto/list-following.dto';
import { FollowingRelationshipsService } from './following-relationships.service';

@ApiTags('Following relationships')
@Controller('following-relationships')
export class FollowingRelationshipsController {

    constructor(
        private readonly followingRelationShipsService: FollowingRelationshipsService
    ) { }

    @Post('follow')
    @ApiOperation({ summary: 'Create a new follow relationship with other user' })
    @ApiBearerAuth('access-token')
    @ApiResponse({ status: 201, schema: { example: { message: 'Followed user have id: userId' } } })
    @ApiResponse({
        status: 400, schema: {
            example: {
                status: 400, message: ['Already followed user have id: userId', "followedUserId should not be empty",
                    "followedUserId must be a number conforming to the specified constraints"], error: 'Bad request'
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
        status: 404, schema: {
            example: { status: 404, message: ['Token not found', 'User have id-userId does not exist'], error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    follow(@Body() followDto: FollowDto, @Request() req): Promise<any> {
        return this.followingRelationShipsService.follow(followDto, parseInt(req.headers.id));
    }

    @Delete('unfollow')
    @ApiOperation({ summary: 'Delete a follow relationship with other user' })
    @ApiBearerAuth('access-token')
    @ApiResponse({ status: 201, schema: { example: { message: 'Unfollowed user have id: userId' } } })
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
            example: { status: 404, message: ['Token not found', 'User have id-userId does not exist'], error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    unfollow(@Body() followDto: FollowDto, @Request() req): Promise<any> {
        return this.followingRelationShipsService.unfollow(followDto, parseInt(req.headers.id));
    }

    @Get('get-following')
    @ApiOperation({ summary: 'Get total following of a specific user' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        schema: {
            example: {
                data: [
                    {
                        user: {
                            id: "number",
                            fullName: "string",
                            avatar: "string"
                        },
                        isFollowing: "boolean"
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
        status: 404, schema: {
            example: { status: 404, message: ['Token not found', 'User have id-userId does not exist'], error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    async getFollowing(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Query('userId', ParseIntPipe) userId: number, @Request() req): Promise<any> {
        return await this.followingRelationShipsService.getInfoFollowing(limit, page, userId, req.headers.id);
    }

    @Get('get-follower')
    @ApiOperation({ summary: 'Get total follower of a specific user' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        schema: {
            example: {
                data: [
                    {
                        user: {
                            id: "number",
                            fullName: "string",
                            avatar: "string"
                        },
                        isFollowing: "boolean"
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
        status: 404, schema: {
            example: { status: 404, message: ['Token not found', 'User have id-userId does not exist'], error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    async getFollower(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Query('userId', ParseIntPipe) userId: number, @Request() req): Promise<any> {
        return await this.followingRelationShipsService.getInfoFollower(limit, page, userId, req.headers.id);
    }


    @Get('/recommend-friend')
    @ApiOperation({ summary: 'Get list of recommend friends' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({schema: {example: [{id: "number", fullName: "string", avatar: "string"}]}})
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
            example: { status: 404, message: ['Token not found'], error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    recommendFriend(@Request() req): Promise<any>{
        return this.followingRelationShipsService.recommendNewUser(req.headers.id);
    }
}
