import {expect} from '../base';
import sinon from 'sinon';
import nodeMailer from 'nodemailer';
import Mailer from '../../api/helpers/Mailer';
import Email from '../../api/repositories/email';

afterEach(() => {
  sinon.restore();
});

describe('Helper: Mailer', () => {
  let to = 'amrendonsa+mailer@unal.edu.co';
  let subject = 'Test';
  let html = '<p>Test</p>';
  let email = Email.create(to, subject, html);
  it('should throw an error if not NodeMailer injected', () => {
    expect(Mailer.create()).to.be.an('Error');
  });
  it('should throw an error if Email has not been injected', () => {
    expect(Mailer.create(nodeMailer)).to.be.an('Error');
  });
  it('should create a mailer helper instance ready to sent an email', () => {
    const createTransport = sinon.spy(nodeMailer, 'createTransport');
    const mailer = Mailer.create(nodeMailer, email);
    expect(createTransport.calledOnce).to.be.true;
    expect(mailer.email).to.deep.equal(email);
  });
  it('should send the email', () => {
    const mailOptions = sinon.spy(email, 'mailOptions');
    const mailer = Mailer.create(nodeMailer, email);
    const sendMail = sinon.spy(mailer.transport, 'sendMail');
    return mailer.sendMail()
      .then(res => {
        expect(res.response).to.be.a('string');
        expect(sendMail.calledOnce).to.be.true;
        expect(mailOptions.calledOnce).to.be.true;
      });
  });
});
