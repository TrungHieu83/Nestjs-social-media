import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(
        private readonly authService : AuthService
    ){}
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.headers.authorization) {
            const tokenFromClient = req.headers.authorization.split(' ')[1] 
            var {isValid, mess, id, email} = await this.authService.verifyToken(tokenFromClient)
            if(!isValid){
                throw new UnauthorizedException('Token is invalid');
            }
            req.headers.email = email
            req.headers.id = id.toString()
            
        }else{
            throw new NotFoundException('Token not found');
        }      
        next();
    }
}
