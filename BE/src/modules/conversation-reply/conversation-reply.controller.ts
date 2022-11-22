import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversationReplyService } from './conversation-reply.service';
import { ConversationReplyDto } from './dto/conversation-reply.dto';


@ApiTags('Conversation reply')
@Controller('conversation-reply')
export class ConversationReplyController {
    constructor(
        private conversationReplyService: ConversationReplyService,
    ) { }

    @Get()
    @ApiOperation({summary: 'Get messages in a post'})
    @ApiBearerAuth('access-token')
    @ApiOkResponse({
        schema: {
            example: {
                data: [{
                    id: 'number',
                    text: 'string',
                    createdDate: 'Date',
                    isRead: 'boolean',
                    conversationId: 'number',
                    userReply: {
                        id: 'number',
                        fullName: 'string',
                        avatar: 'string',
                    }
                }],
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
            example: { statusCode: 404, message: ['Token not found', 'Conversation have id-conversationId does not exist'], error: 'Not found' }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    async getMessages(@Query('conversationId') conversationId: number, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10): Promise<ConversationReplyDto[]> {
        return this.conversationReplyService.getMessages(limit, page, conversationId);
    }
}
