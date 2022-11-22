import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { config } from 'dotenv';
config();
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, 
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD 
        },
      },
      defaults: {
        from: '"nest-modules" <user@outlook.com>', 
      },
    }),
  ],
  providers: [MailService],
  exports:[MailService]
})
export class MailModule { }