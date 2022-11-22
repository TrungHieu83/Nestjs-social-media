import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Request, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtension, ApiOkResponse, ApiOperation, ApiProduces, ApiProperty, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger'
import { ResetPasswordDto } from './dto/user-reset-password.dto';
import { UserEmailDto } from './dto/email-reset-password.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('reset-password')
    @ApiOperation({ summary: 'Send an email with a verification code' })
    @ApiOkResponse({ schema: { example: { message: 'Check your mail!' } } })
    @ApiResponse({
        status: 400, description: 'Bad request', schema: {
            example: {
                "statusCode": 400,
                "message": [
                    "email must be not empty",
                    "email must be an email"
                ],
                "error": "Bad Request"
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Not found', schema: { example: { status: 404, message: 'The email is not registered', error: 'Not found' } } })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    @ApiResponse({ status: 502, description: 'Bad gateway', schema: { example: { status: 502, message: 'Can not send email', error: 'Bad gateway' } } })
    sendSecurityCode(@Body() email: UserEmailDto): Promise<any> {
        return this.userService.sendSecurityCode(email.email);
    }

    @Put('reset-password')
    @ApiOperation({ summary: 'Reset password' })
    @ApiOkResponse({ schema: { example: { message: 'Password is changed' } } })
    @ApiResponse({
        status: 400, description: 'Bad request', schema: {
            example: {
                "statusCode": 400,
                "message": [
                    "email should not be empty",
                    "email must be an email",
                    "newPassword should not be empty",
                    "securityCode should not be empty"
                ],
                "error": "Bad Request"
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized', schema: { example: { status: 401, message: 'Security code is incorrect', error: 'Unauthorized' } } })
    @ApiResponse({ status: 500, description: 'Internal server', schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    resetPassword(@Body() info: ResetPasswordDto) {
        return this.userService.resetPassword(info)
    }

    @Get('user-profile/:id')
    @ApiOperation({ summary: 'Get user information for profile page' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ schema: { example: { fullName: "string", cover: "string", avatar: "string", totalPost: "number", totalFollower: "number", totalFollowing: "number", isFollowing: "boolean" } } })
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
                "message": ["Token not found", "User have id-userId does not exist"],
                "error": "Not Found"
            }
        }
    })
    @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
    async getUserInformation(@Param('id') id: number, @Request() req) {
        return await this.userService.getUserInformation(id, req.headers.id);
    }

    @Post('upload-avatar')
    @ApiOperation({ summary: 'Upload avatar to firebase' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ schema: { example: { avatarUrl: 'string' } } })
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
                    type: 'string',
                    format: 'binary'
                }
            },
        },
    })
    @UseInterceptors(AnyFilesInterceptor())
    uploadAvatar(@UploadedFiles() file: Array<Express.Multer.File>, @Request() req) {
        return this.userService.uploadAvatar(file[0], req.headers.id);
    }

    @Post('upload-cover')
    @ApiOperation({ summary: 'Upload cover to firebase' })
    @ApiOperation({ summary: 'To upload avatar' })
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ schema: { example: { coverUrl: 'string' } } })
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
                    type: 'string',
                    format: 'binary'
                }
            },
        },
    })
    @UseInterceptors(AnyFilesInterceptor())
    uploadCover(@UploadedFiles() file: Array<Express.Multer.File>, @Request() req) {
        return this.userService.uploadCover(file[0], req.headers.id);
    }

    



}
