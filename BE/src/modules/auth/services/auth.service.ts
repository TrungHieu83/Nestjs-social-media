import {
    BadRequestException,
    CACHE_MANAGER,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserDto } from 'src/modules/users/dto/users.dto';
import { LoginDto } from '../dto/user-login.dto';
import { config } from 'dotenv';
import { Cache } from 'cache-manager'
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { FacebookLoginDto } from '../dto/user-facebook-login.dto';
import { MailService } from 'src/modules/mail/mail.service';
export interface Token {
    id: number;
    email: string;
}

config();
@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private userService: UsersService,
        private jwtService: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(forwardRef(() => MailService)) private mailService: MailService
    ) { }

    async loginWithFacebook(facebookLoginDto: FacebookLoginDto): Promise<any> {
        const user = await this.userService.findByFacebookUserId(facebookLoginDto.id, facebookLoginDto.fullName);
        const id = user[0].id;
        const email = null;
        const accessToken = this.generateToken({ id, email }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION);
        const refreshToken = this.generateToken({ id, email }, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRATION);
        await this.cacheManager.set(user[0].id.toString(), refreshToken, { ttl: 1000 })
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            userId: user[0].id,
            fullName: user[0].fullName,
            avatar: user[0].avatar

        }
    }

    async login(userLogin: LoginDto): Promise<any> {
        const user = await this.userService.findByEmail(userLogin.email);
        if (user == null || !await bcrypt.compare(userLogin.password, user.password) || user.accountStatus == 0) {
            // if(userLogin.isFirst){
            //     const verificationCode = Math.floor(Math.random() * 10000);
            //     this.userService.updateVerificationCode(userLogin.email, verificationCode.toString());
            //     this.mailService.verifyEmail(userLogin.email, verificationCode);
            // }
            throw new UnauthorizedException('Email or password is incorrect!!')
        }
        //generate access token
        const accessToken = this.generateToken(user, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION)
        const refreshToken = this.generateToken(user, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRATION)
        await this.cacheManager.set(user.id.toString(), refreshToken, { ttl: 1000 })
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            userId: user.id,
            fullName: user.fullName,
            avatar: user.avatar
        }
    }

    generateToken(user: UserDto | { id: number, email: string }, secretSignature: string, tokenLife: string) {
        const options: JwtSignOptions = {
            secret: secretSignature
        }
        options.expiresIn = tokenLife
        const email = user.email
        return this.jwtService.sign(
            {
                id: user.id,
                email
            },
            options
        )
    }

    async verifyToken(token: string) {
        const options: JwtSignOptions = {
            secret: process.env.ACCESS_TOKEN_SECRET
        }
        options.expiresIn = process.env.ACCESS_TOKEN_EXPIRATION
        let decoded = this.jwtService.decode(token) as Token
        if (!decoded) {
            return {
                isValid: false,
                mess: "Invalid token",
                id: -1,
                email: ''
            }
        }
        try {
            this.jwtService.verify<Token>(token, options)
            return {
                isValid: true,
                mess: "Valid token",
                ...decoded
            }
        } catch (e) {
            return {
                isValid: false,
                mess: "Access token timeout",
                ...decoded
            }
        }
    }

    async verifyRefreshToken(refreshTokenFromClient: string) {
        const { id } = this.jwtService.decode(refreshTokenFromClient) as Token
        const refreshToken = await this.cacheManager.get(id.toString()) as string
        if (refreshToken && refreshToken.localeCompare(refreshTokenFromClient) == 0) {
            try {
                const options: JwtSignOptions = {
                    secret: process.env.REFRESH_TOKEN_SECRET
                }
                options.expiresIn = process.env.REFRESH_TOKEN_EXPIRATION
                this.jwtService.verify<Token>(refreshTokenFromClient, options)
                const { id, email } = this.jwtService.decode(refreshToken) as Token
                return { access_token: this.generateToken({ id, email }, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION) }
            } catch (e) {
                await this.cacheManager.del(id.toString())
                throw new ForbiddenException('Refresh token timeout')
            }
        } else {
            throw new UnauthorizedException('Refresh token does not exist')
        }
    }

    async verifyEmail(verificationCode: string, id: number) {
        const verificationCodeCache = await this.cacheManager.get(`verify-${id}`) as string;
        const user = await this.userService.findOne(id);
        if (verificationCodeCache == null && user.accountStatus == 0) {
            const newVerificationCode = Math.floor(Math.random() * 100000).toString();
            this.cacheManager.set(`verify-${id}`, newVerificationCode, { ttl: 86400 });
            this.mailService.verifyEmail(user.email, newVerificationCode, id);
            throw new UnauthorizedException('Verification code time out');
        } else if (verificationCodeCache != verificationCode && user.accountStatus == 0) {
            throw new UnauthorizedException('Verification code is invalid');
        } else if (user.accountStatus == 1) {
            throw new BadRequestException('Email is already being verified')
        } else {
            await this.userService.updateStatus(user.email);
            await this.cacheManager.del(`verify-${id}`);
            return {message: 'Verification successful'}
        }

    }


}
