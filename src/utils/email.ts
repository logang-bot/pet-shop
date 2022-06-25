import nodemailer from 'nodemailer';
import htmlToText from 'html-to-text';

export default class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: any, url: any) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    // this.from = `Logang Osas <${process.env.EMAIL_FROM}>`;
    this.from = `Alvaro Choque <logangch8v@gmail.com>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.EMAIL_SENDGRID_USERNAME,
        pass: process.env.EMAIL_SENDGRID_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(subject: string, message: string) {
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send(
      `Hola ${this.firstName}, te mandamon el link para reestablecer tu password`,
      this.url
    );
  }
}
