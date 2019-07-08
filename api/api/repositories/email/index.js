import HtmlToText from 'html-to-text';

/**
 * Email base class.
 * An email basic template handler ready to be passed to the mailer.
 */
class Email {
  constructor(to, subject, html) {
    this.to = `${to},uec_fibog@unal.edu.co,amrendonsa@unal.edu.co`;
    this.subject = subject;
    this.html = html;
    this.text = HtmlToText.fromString(this.html, {
      wordwrap: 100,
    });
  }

  /**
   * Email creator.
   * @param to Email addres this email should be sent to
   * @param subject Email subject
   * @param html Email html template
   * @returns {<Email|Error>}
   */
  static create(to, subject, html) {
    if (!!to && !!subject && !!html)
      return new Email(to, subject, html);
    return new Error('Missing parameters');
  }

  /**
   * Returns the mail options
   * @returns {Email}
   */
  mailOptions() {
    return this;
  }

  /**
   * Returns email's string tag
   * @returns {string}
   */
  get [Symbol.toStringTag]() {
    return 'Email';
  };
}

module.exports = Email;
