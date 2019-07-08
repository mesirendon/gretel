import Email from '../';
import fs from 'fs';

/**
 * Certification email.
 * An email template for the certification notification
 */
class CertificationEmail extends Email {
  constructor(mailStyler, to, variables, attachments) {
    const html = fs.readFileSync(`${__dirname}/CertificationEmail.html`).toString();
    const css = fs.readFileSync(`${__dirname}/../mail.css`).toString();
    mailStyler.addCss(css);
    for (const [k, v] of Object.entries(variables)) {
      mailStyler.set(k, v);
    }
    super(to, 'Correo de certificación', mailStyler.html(html));
    this.attachments = [
      {
        filename: 'cert.pdf',
        content: attachments.Pdf,
      },
      {
        filename: 'qrcode.png',
        content: attachments.qrCode,
        cid: 'qrcode',
      }
    ];
  }

  /**
   * CertificationEmail creator.
   * @param {HtmlMailStyler} mailStyler.
   * @param {String} to Student email address this email should be sent to
   * @param {Object} info Email info to populate template
   * @param {String} info.name Student name
   * @param {String} info.courseName Course name
   * @param {String} info.link Certification link
   * @param {String} info.home Home page
   * @param {String} info.hash IPFS Hash
   * @param {Object} attachments Buffers to be included into this template
   * @param {Buffer} attachments.qrCode QRCode buffer to embed into the mail body
   * @param {Buffer} attachments.Pdf PDF Certification buffer to be attached into the email
   * @returns {CertificationEmail|Error}
   */
  static create(mailStyler, to, info = {}, attachments = {}) {
    if (
      !!mailStyler &&
      !!to &&
      Object.keys(info).length === 5 &&
      Object.keys(attachments).length === 2
    )
      return new CertificationEmail(mailStyler, to, info, attachments);
    return new Error('Missing parameters');
  }

  /**
   *  Returns certification email's string tag
   * @returns {string}
   */
  get [Symbol.toStringTag]() {
    return 'CertificationEmail';
  }
}

module.exports = CertificationEmail;
