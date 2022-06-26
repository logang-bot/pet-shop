import mailjet from 'node-mailjet';

export default class Email {
  to: string;
  firstName: string;
  from: string;

  constructor(user: any, public url: string) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.from = `logangch8v@gmail.com`;
  }

  newTransport() {
    return mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC || '',
      process.env.MJ_APIKEY_PRIVATE || ''
    );
  }

  // Send the actual email
  async send(subject: string, message: string) {
    // 2) Define email options

    // 3) Create a transport and send email
    await this.newTransport()
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: this.from,
              Name: 'PetShop',
            },
            To: [
              {
                Email: this.to,
                Name: this.firstName,
              },
            ],
            Subject: subject,
            HTMLPart: message,
          },
        ],
      });
  }

  async sendPasswordReset() {
    await this.send(
      `Hola ${this.firstName}, te mandamos el link para reestablecer tu password`,
      `<h3>Haga click en el siguiente link para ir a la pantalla de recuperacion de password <a href="${this.url}">Resetear mi password</a>!</h3><br />Recuerda crear un password seguro`
    );
  }
}
