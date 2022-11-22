import { BadGatewayException, HttpCode, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { config } from 'dotenv';
config();
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async verifyEmail(toEmail: string, verificationCode: string, userId: number): Promise<any> {
    const content: EmailContent = {
      to: toEmail,
      subject: 'Verify your email',
     html: 'Please click the link below to verify your registration'
        + '<h3><a href="https://test123-ten.vercel.app/verify-email/' + verificationCode + '/' + userId + '" target="_self">VERIFY</a></h3>'
    }
    return await this.sendEmail(content)
  }

  async resetPasswordEmail(toEmail: string, securityCode: number): Promise<any> {
    const content: EmailContent = {
      to: toEmail,
      subject: 'Reset your password',
      html: 'We have received your request to reset your Facebook password. Your security code to reset password is : '
        + '<h2>'+securityCode+'<h2/>'
    }
    return await this.sendEmail(content)
  }

  async sendEmail(content: EmailContent) {
    try {
      const result = await this.mailerService.sendMail({
        to: content.to,
        from: process.env.MAIL_FROM,
        subject: content.subject,
        html: content.html
      })
      return { message: 'Check your mail!' }
    } catch (error) {
      throw new BadGatewayException('Can not send email')
    }
  }

}
interface EmailContent {
  to: string
  subject: string
  html: string
}