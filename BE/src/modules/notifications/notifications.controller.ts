import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {

    constructor(
        private notificationsService: NotificationsService
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get notifications of a user' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ schema: { example: [{ id: "number", isRead: "boolean", content: "string", createdDate: "datetime", userId: "number", fullName: "string", avatar: "string" }] } })
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
    get5Notification(@Request() req) {
        return this.notificationsService.getTop5(parseInt(req.headers.id));
    }
}
