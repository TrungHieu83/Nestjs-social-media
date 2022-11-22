
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    JwtModule.register(null),
    UsersModule,
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService,FacebookStrategy],
  exports: [ AuthService, JwtModule],
})
export class AuthModule {}