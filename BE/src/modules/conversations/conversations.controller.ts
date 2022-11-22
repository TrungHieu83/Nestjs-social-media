import { Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { ConversationsDto } from './dto/conversations.dto';

@ApiTags('Conversations')
@Controller('conversations')
export class ConversationsController {
    constructor(
        private conversationService: ConversationsService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get conversations of a user' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        schema: {
            example: {
                data: [
                    {
                        id: "number",
                        lastReply: {
                            id: 'number',
                            text: 'string',
                            createdDate: 'Date',
                            isRead: 'boolean',
                            userReply: {
                                id: 'number',
                                fullName: 'string',
                                avatar: 'string',
                            }
                        },
                        user: {
                            id: 'number',
                            fullName: 'string',
                            avatar: 'string'
                        }
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
            example: { statusCode: 404, message: ['Token not found', 'User have id-userId does not exist'], error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    getConversations(@Query('userId') userId: number, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,): Promise<ConversationsDto[]> {
        return this.conversationService.getConversations(limit, page, userId);
    }


    @Delete(':conversationId')
    @ApiOperation({summary: 'Delete a conversation'})
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ schema: { example: { message: 'Conversation have id-conversationId is deleted' } } })
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
            example: { statusCode: 404, message: ['Token not found', 'Conversation have id-conversationId does not exist'], error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    async deleteConversation(@Param('conversationId') conversationId: number) {
        return await this.conversationService.deleteConversation(conversationId);
    }

    @Get(':userId')
    @ApiOperation({summary: 'Get conversationId with other user'})
    @ApiBearerAuth('access-token')
    @ApiOkResponse({schema:{example:{conversationId: "number"}}})
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
            example: { statusCode: 404, message: ['Token not found', 'User have id-userId does not exist'], error: 'Not found' }
        }
    })
    async getConversation(@Request() req, @Param('userId') userId: number){
        return await this.conversationService.getConversation(userId, req.headers.id);
    }
}
