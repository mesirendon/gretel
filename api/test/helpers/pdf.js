import {expect} from '../base';
import Pdf from '../../api/helpers/pdf';
import QRcoder from '../../api/helpers/qrcode';
import moment from 'moment';
import pdfParse from 'pdf-parse';
import fs from 'fs';

describe('Helper: PDF', () => {
  const user = {
    studentId: '123123123',
    studentName: 'Leonhard Paul Euler',
    courseName: 'Advanced Algorithms',
    courseIntensity: '45',
    courseStartDate: moment().format('YYYY-MM-DD'),
    courseFinishDate: moment().add(1, 'month').format('YYYY-MM-DD'),
  };
  describe('Basic Pdf file', () => {
    const certificate = Pdf.create(user);
    it('should return a PDF instance ', () => {
      expect(certificate).to.be.a('Pdf');
      return certificate.eventualPdfBuffer.then((pdfBuffer) => {
        expect(pdfBuffer instanceof Buffer).to.be.true;
      });
    });
    it('should have user information within the PDF', () => {
      return certificate.eventualPdfBuffer
        .then((pdfBuffer) => pdfParse(pdfBuffer))
        .then((pdf) => {
          expect(pdf.text).with.contain(user.studentName);
          expect(pdf.text).with.contain(user.studentId);
          expect(pdf.text).with.contain(user.courseName);
          expect(pdf.text).with.contain(user.courseIntensity);
          expect(pdf.text).and.not.have.contain('bla123bla')
        });
    });
  });
  describe('Certificate including a QRCode', () => {
    it('should create a Pdf file with a qrcode', () => {
      return QRcoder.encode('Testing a sample QRCode')
        .then(qrcodeBuffer => Pdf.create(user, qrcodeBuffer).eventualPdfBuffer)
        .then(pdfBuffer => {
          fs.writeFileSync('./Testing.pdf', pdfBuffer);
          return pdfParse(pdfBuffer);
        })
        .then((pdf) => {
          expect(pdf.text).with.contain(user.studentName);
          expect(pdf.text).with.contain(user.studentId);
          expect(pdf.text).with.contain(user.courseName);
          expect(pdf.text).with.contain(user.courseIntensity);
          expect(pdf.text).and.not.have.contain('bla123bla')
        });
    })
  })
});
