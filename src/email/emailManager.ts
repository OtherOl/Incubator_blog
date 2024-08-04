import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { userModel } from '../base/types/users.model';

@Injectable()
export class EmailManager {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailConfirmationCode(user: userModel) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'OtherOl BackEnd<dmitrybackenddev@gmail.com>',
      subject: 'Confirmation code',
      html:
        '<h1>Thanks for your registration</h1>' +
        `<p style="font-size: 18px;">To finish registration please enter cofirmation code:
                    <a href='http://localhost:8080/confirm-email?code=${user.emailConfirmation.confirmationCode}'>
                    "Confirm registration"</a></p>`,
    });
  }

  async resendConfirmationCode(user: userModel, code: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'OtherOl BackEnd<dmitrybackenddev@gmail.com>',
      subject: 'Confirmation code',
      html:
        '<h1>Thanks for your registration</h1>' +
        `<p style="font-size: 18px;">To finish registration please enter cofirmation code:
                    <a href='http://localhost:8080/confirm-email?code=${code}'>
                    "Confirm registration"</a></p>`,
    });
  }

  async sendRecoveryCode(user: userModel) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'OtherOl BackEnd<dmitrybackenddev@gmail.com>',
      subject: 'Confirmation code',
      html:
        '<h1>Thanks for your registration</h1>' +
        `<p style="font-size: 18px;">To finish registration please enter cofirmation code:
                    <a href='http://localhost:8080/confirm-email?code=${user.recoveryConfirmation.recoveryCode}'>
                    "Confirm registration"</a></p>`,
    });
  }
}
