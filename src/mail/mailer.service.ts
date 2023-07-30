import { Injectable } from '@nestjs/common';
import * as Mailjet from 'node-mailjet';

@Injectable()
export class MailerService {
  private mailer: Mailjet.Client;

  constructor() {
    this.mailer = new Mailjet.Client({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_SECRET_KEY,
    });
  }

  async sendEmail({ email, nickname, context, verifyCode }) {
    let Subject: string;
    let TextPart: string;
    let HTMLPart: string;
    if (context === 'signup') {
      Subject = 'Welcome to Twitter!';
      TextPart = `welcome to Twitter!, ${nickname} Here is your 6 digit code: ${verifyCode}`;
      HTMLPart = `<h3>Dear ${nickname}, welcome to <a href="https://www.twitter.com/">Twitter</a>!</h3><br />Here is your 6 digit code: <b>${verifyCode}</b>`;
    } else if (context === 'forgot-password') {
      Subject = 'Reset Password - Twitter';
      TextPart = `Here is your 6 digit code: ${verifyCode}`;
      HTMLPart = `<h3>Here is your 6 digit code: <b>${verifyCode}</b></h3>`;
    }

    return this.mailer.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'zefek10@gmail.com',
            Name: 'Mailjet Pilot',
          },
          To: [
            {
              Email: email,
              Name: nickname,
            },
          ],
          Subject,
          TextPart,
          HTMLPart,
        },
      ],
    });
  }
}
