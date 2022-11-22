import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/user-login.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshToken } from '../dto/refresh-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UsersService } from 'src/modules/users/users.service';
import { FacebookLoginDto } from '../dto/user-facebook-login.dto';
import { UserVerifyEmailDto } from '../dto/user-verify-email.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService
  ) { }


  @Post('login')
  @ApiOkResponse({ schema: { example: { refresh_token: "string", access_token: "string", userId: "number", fullName: "string", avatar: "string" } } })
  @ApiResponse({ status: 401, description: 'Unauthorized', schema: { example: { status: 401, message: "Email or password is incorrect!!", error: "Unauthorized" } } })
  @ApiResponse({
    status: 400, description: 'Bad request', schema: {
      example: {
        status: 400, messages: [
          "email must be an email",
          "email should not be empty",
          "password must be a string",
          "password should not be empty"
        ], error: 'Bad request'
      }
    }
  })
  @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
  login(@Body() userLogin: LoginDto) {
    return this.authService.login(userLogin)
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Get a new access token when current access token expired' })
  @ApiBearerAuth('refresh-token')
  @ApiOkResponse({ schema: { example: { access_token: "string" } } })
  @ApiResponse({ status: 401, description: 'Refresh token does not exist', schema: { example: { status: 401, message: "Refresh token does not exist", error: "Unauthorized" } } })
  @ApiResponse({ status: 403, description: 'Refresh token timeout', schema: { example: { status: 403, message: "Refresh token timeout", error: "Forbidden" } } })
  refreshToken(@Body() refreshTokenFromClient: RefreshToken) {
    return this.authService.verifyRefreshToken(refreshTokenFromClient.refreshToken)
  }

  @Post('users/register')
  @ApiOkResponse({ schema: { example: { message: 'Check your mail!' } } })
  @ApiResponse({ status: 409, description: 'Conflict', schema: { example: { status: 409, message: "This email address is already being used", error: "Conflict" } } })
  @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
  @ApiResponse({ status: 502, description: 'Bad gateway', schema: { example: { status: 502, message: 'Can not send email', error: 'Bad gateway' } } })
  @ApiBody({ type: UserRegisterDto })
  addUser(@Body() user: UserRegisterDto): Promise<UserRegisterDto> {
    console.log(1231231)
    return this.userService.addUser(user)
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Send mail to user for mail verification' })
  @ApiOkResponse({ schema: { example: { message: 'Verification successful' } } })
  @ApiResponse({
    status: 400, description: 'Bad request', schema: {
      example: {
        status: 400, messages: [
          "verifyCode should not be empty",
          "verifyCode must be a string",
          "email must be a string",
          "email should not be empty",
          "email must be an email"
        ], error: 'Bad request'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', schema: { example: { status: 400, messages: 'Verify code is invalid', error: 'Unauthorized' } } })
  @ApiResponse({ status: 404, description: 'Not found', schema: { example: { status: 404, message: 'User have email-userEmail does not exist', error: 'Not found' } } })
  @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
  verifyEmail(@Body() verifyEmail: UserVerifyEmailDto): Promise<any> {
    return this.authService.verifyEmail(verifyEmail.verificationCode, verifyEmail.id)
  }

  @Post('/facebook-login')
  @ApiOperation({ summary: 'Login with facebook' })
  @ApiOkResponse({ schema: { example: { refresh_token: "string", access_token: "string", userId: "number", fullName: "string", avatar: "string" } } })
  @ApiResponse({
    status: 400, description: 'Bad request', schema: {
      example: {
        status: 400, messages: [
          "id should not be empty",
          "id must be a number conforming to the specified constraints",
          "fullName must be a string",
          "fullName should not be empty"
        ], error: 'Bad request'
      }
    }
  })
  @ApiResponse({ status: 500, schema: { example: { status: 500, message: 'Something blow up with our code', error: 'Internal server' } } })
  async facebookLogin(@Body() facebookLoginDto: FacebookLoginDto): Promise<any> {
    return await this.authService.loginWithFacebook(facebookLoginDto);
  }
}