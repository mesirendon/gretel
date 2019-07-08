import {expect} from '../base';
import HtmlMailStyler from 'html-mail-styler';
import sinon from 'sinon';
import Email from '../../api/repositories/email';
import CertificationEmail from '../../api/repositories/email/CertificationEmail';
import QRCoder from '../../api/helpers/qrcode';
import Pdf from '../../api/helpers/pdf';

afterEach(() => {
  sinon.restore();
});

describe('Repository: Email', () => {
  describe('Email', () => {
    const emailAddress = 'a@a.com';
    const subject = 'Test';
    const html = '<p>hola</p>';
    const email = Email.create(emailAddress, subject, html);
    it('should be an error if not email parameters provided', () => {
      expect(Email.create()).to.be.an('Error');
    });
    it('should be an error if not html provided', () => {
      expect(Email.create('a@a.com', 'Algo')).to.be.an('Error');
    });
    it('should have email parameters complete', () => {
      expect(email).to.be.an('Email');
      expect(email.to).to.eq(emailAddress);
      expect(email.subject).to.eq(subject);
      expect(email.html).to.eq(html);
      expect(email.text).to.eq('hola');
    });
    it('should return the mail options for the mailer helper', () => {
      expect(email.mailOptions()).to.have.all.keys('to', 'subject', 'text', 'html');
    });
  });
  describe('Certification Email', () => {
    const emailAddress = 'a@a.com';
    const name = 'AA';
    const courseName = 'Course';
    const link = 'd123j';
    const home = 'http://certs.unal.edu.co';
    const hash = 'asdasd';
    const eventualQr = QRCoder.encode('testing');
    const eventualPdf = Pdf.create('123', name, courseName, '2019-01-01', '2019-02-01').eventualPdfBuffer;
    it('should be an error if not email parameters provided', () => {
      return eventualQr.then(qrCode => {
        expect(CertificationEmail.create()).to.be.an('Error');
        expect(CertificationEmail.create(new HtmlMailStyler())).to.be.an('Error');
        expect(CertificationEmail.create(new HtmlMailStyler(), emailAddress)).to.be.an('Error');
        expect(CertificationEmail.create(new HtmlMailStyler(), emailAddress, {name})).to.be.an('Error');
        expect(CertificationEmail.create(new HtmlMailStyler(), emailAddress, {
          name,
        })).to.be.an('Error');
        expect(CertificationEmail.create(new HtmlMailStyler(), emailAddress, {
          name,
          courseName,
        })).to.be.an('Error');
        expect(CertificationEmail.create(new HtmlMailStyler(), emailAddress, {
          name,
          courseName,
          link,
        })).to.be.an('Error');
        expect(CertificationEmail.create(new HtmlMailStyler(), emailAddress, {
          name,
          courseName,
          link,
          home,
        })).to.be.an('Error');
        expect(CertificationEmail.create(new HtmlMailStyler(), emailAddress, {
          name,
          courseName,
          link,
          home,
          hash
        })).to.be.an('Error');
        expect(CertificationEmail.create(
          new HtmlMailStyler(),
          emailAddress,
          {
            name,
            courseName,
            link,
            home,
            hash,
          },
          {
            qrCode,
          }
          )
        ).to.be.an('Error');
      });
    });
    it('should be an instance of CertificationEmail and Email at the same time', () => {
      const ms = new HtmlMailStyler();
      const addCss = sinon.spy(ms, 'addCss');
      const set = sinon.spy(ms, 'set');
      const html = sinon.spy(ms, 'html');
      return Promise.all([eventualQr, eventualPdf])
        .then(values => {
          const [qrCode, Pdf] = values;
          const info = {
            name,
            courseName,
            link,
            home,
            hash,
          };
          const attachments = {
            qrCode,
            Pdf,
          };
          const certificationEmail = CertificationEmail.create(
            ms,
            emailAddress,
            info,
            attachments
          );
          expect(certificationEmail).to.be.an('CertificationEmail');
          expect(certificationEmail instanceof Email).to.be.true;
          expect(certificationEmail instanceof CertificationEmail).to.be.true;
          expect(addCss.calledOnce).to.be.true;
          expect(set.callCount).to.eq(Object.keys(info).length);
          expect(html.calledOnce).to.be.true;
        })
    });
  })
});
