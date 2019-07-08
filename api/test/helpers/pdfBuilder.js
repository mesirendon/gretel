import {expect} from '../base';
import Pdf from '../../api/helpers/pdfBuilder';
import QRcoder from '../../api/helpers/qrcode';
import moment from 'moment';
import pdfParse from 'pdf-parse';
import fs from 'fs';

describe('Helper: PDFBuilder', () => {
  const user = {
    studentId: 'CC123123123',
    studentName: 'Leonhard Paul Euler',
    courseName: 'Metodologías ágiles en la Gestión de Proyectos - SCRUM',
    courseStartDate: moment().format("YYYY-MM-DD"),
    courseFinishDate: moment().add(1, 'month').format("YYYY-MM-DD"),
    courseDeliveredDate:moment().add(1, 'month').format("YYYY-MM-DD"),
    courseIntensity:'45',
    secretaryName:'Grace Murray Hopper'
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
          let [,idType,idNumber]=user.studentId.match(/([A-Za-z]*)(\d*)/);
          expect(pdf.text).to.contain(user.studentName);
          expect(pdf.text).to.contain(idType.replace(/(.{1})/g,'$1.'));
          expect(pdf.text).to.contain(idNumber)
          expect(pdf.text.replace(/(\n)/g,'')).to.contain(user.courseName);
          expect(pdf.text).with.contain(user.courseIntensity);
          expect(pdf.text).and.not.have.contain('bla123bla')
        });
    });
    it('should return a valid buffer so a PDF reader cant open it',()=>{
      return certificate.eventualPdfBuffer
        .then(pdfBuffer=>{
          fs.writeFileSync('./certificate1.pdf',pdfBuffer);
        })
    });
  });

  describe('creating PDF multiple times',()=>{
    it('should create a pdf without repeting info ',()=>{
      Pdf.create(user).eventualPdfBuffer.then(pdfBuffer=>{
        fs.writeFileSync('./certificate2.pdf',pdfBuffer);
      })
    });
    it('should create a pdf without repeting info ',()=>{
      Pdf.create(user).eventualPdfBuffer.then(pdfBuffer=>{
        fs.writeFileSync('./certificate3.pdf',pdfBuffer);
      })
    });
    it('should create a pdf without repeting info ',()=>{
      Pdf.create(user).eventualPdfBuffer.then(pdfBuffer=>{
        fs.writeFileSync('./certificate4.pdf',pdfBuffer);
      })
    });
  });


  describe('Pdf file', () => {
    it('should have a QR Code and Student info',()=>{
      return QRcoder.encode('something').then(qrCodeBuffer=>{
        Pdf.create(user,qrCodeBuffer).eventualPdfBuffer.then(pdfBuffer=>{
          fs.writeFileSync('./certificateQRCODE.pdf',pdfBuffer);
          return pdfParse(pdfBuffer);
        }).then(buffer=>{
          let [,idType,idNumber]=user.studentId.match(/([A-Za-z]*)(\d*)/);
          expect(buffer.text).to.contain(user.studentName);
          expect(buffer.text).to.contain(idType.replace(/(.{1})/g,'$1.'));
          expect(buffer.text).to.contain(idNumber);
          expect(buffer.text.replace(/(\n)/g,'')).to.contain(user.courseName);
          expect(buffer.text).to.contain(user.courseFinishDate);
          expect(buffer.text).to.contain(user.courseStartDate);
          expect(buffer.text).to.contain(user.courseDeliveredDate);
          expect(buffer.text).to.contain(user.courseIntensity);
          expect(buffer.text).to.contain(user.secretaryName);
        })
      });
    })
  });

 });
