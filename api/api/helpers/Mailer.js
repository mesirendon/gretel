import {config} from 'dotenv';
import Email from '../../api/repositories/email';

config();

/**
 * Mailer helper class
 * This Mailer will send emails upon Email-based template classes
 */
class Mailer {
  constructor(nodeMailer, email) {
    this.from = `IEI ${process.env.MAILER_EMAIL}`;
    this.transport = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    });
    this.email = email;
  }

  /**
   * Creates a new instance of the Mailer helper
   * @param nodeMailer NodeMailer instance
   * @param email Email-based template
   * @returns {<Mailer|Error>}
   */
  static create(nodeMailer, email) {
    if (!!nodeMailer && email instanceof Email)
      return new Mailer(nodeMailer, email);
    return new Error('Missing dependencies');
  }

  /**
   * Sends the email considering all the parameters set within the Email template
   * @returns {Promise<String|Error>}
   */
  sendMail() {
    const mailOptions = {from: this.from, ...this.email.mailOptions()};
    return new Promise((resolve, reject) => {
      this.transport.sendMail(mailOptions)
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = Mailer;
