import {expect} from '../base';
import sinon from 'sinon';
import HtmlMailStyler from 'html-mail-styler';
import CertificationService from '../../api/services/certification';
import CertificationEmail from '../../api/repositories/email/CertificationEmail';
import fs from 'fs';
afterEach(() => {
  sinon.restore();
});

describe('Service: Certifications', () => {
  describe('Certifying a student', () => {
    let ipfsHash;
    let eventualCertificationService = CertificationService.create({
      studentId: 'CC123',
      studentName: 'John Doe',
      studentEmail: 'amrendonsa+mailer@unal.edu.co',
      courseId: '321',
      courseName: 'Curso dummy',
      courseIntensity: '45',
      courseStartDate: '2019-01-01',
      courseFinishDate: '2019-02-01',
    });
    it('should return an error upon incomplete information', () => {
      return CertificationService.create({}).catch(e => {
        expect(e.code).to.eq(400);
        expect(e.detailed).to.match(/Missing parameters:/);
      });
    });
    it('should get a link for the certification based on data', () => {
      return eventualCertificationService
        .then(certificationService => {
          expect(certificationService).to.be.a('CertificationService');
          expect(certificationService.hash).to.match(/[a-f0-9]{64}/);
          expect(certificationService.link).to.match(/https?:\/\/.*\/\?code=[a-f0-9]{64}/);
        });
    });
    it('should get a qrcode eventualPdfBuffer for a given link', () => {
      return eventualCertificationService
        .then(certificationService => {
          expect(certificationService.eventualQrcodeBuffer).to.be.a('Promise');
          return certificationService.eventualQrcodeBuffer;
        })
        .then(qrcodeBuffer => {
          expect(qrcodeBuffer instanceof Buffer).to.be.true;
          expect(qrcodeBuffer).not.to.be.empty;
        });
    });
    it('should get a Pdf eventualPdfBuffer based on metadata and the qrcode eventualPdfBuffer', () => {
      return eventualCertificationService
        .then(certificationService => {
          expect(certificationService.eventualPdfBuffer).to.be.a('Promise');
          return certificationService.eventualPdfBuffer;
        })
        .then(pdfBuffer => {
          expect(pdfBuffer instanceof Buffer).to.be.true;
          expect(pdfBuffer).not.to.be.empty;
          fs.writeFileSync('./certificateFULL.pdf',pdfBuffer);
        });
    });
    it('should send the Pdf eventualPdfBuffer to the IPFS network and get its hash', () => {
      return eventualCertificationService
        .then(certificationService => certificationService.eventualPdfBuffer)
        .then(CertificationService.sendCertificationPdfBufferToIPFS)
        .then(ipfsResponse => {
          expect(ipfsResponse).to.be.an('Object');
          expect(ipfsResponse.hash).to.match(/[0-9a-zA-Z]{46}/);
          ipfsHash = ipfsResponse.hash;
        })
    });
    it('should return a success operation with the transaction hash on certification', () => {
      return eventualCertificationService
        .then(certificationService => CertificationService.sendCertificationInformationToSmartContract(
          certificationService.studentId,
          certificationService.studentName,
          certificationService.studentEmail,
          certificationService.courseId,
          certificationService.courseName,
          certificationService.courseIntensity,
          certificationService.courseStartDate,
          certificationService.courseFinishDate,
          ipfsHash,
          certificationService.hash,
        ))
        .then(txHash => {
          expect(txHash).to.match(/0x[a-f0-9]{64}/)
        })
    });
    it('should get the CertificationEmail template', () => {
      return eventualCertificationService
        .then(certificationService => {
          return Promise.all([
            certificationService.eventualQrcodeBuffer,
            certificationService.eventualPdfBuffer,
          ])
            .then(buffers => CertificationEmail.create(
              new HtmlMailStyler(),
              certificationService.studentEmail,
              {
                name: certificationService.studentName,
                courseName: certificationService.courseName,
                link: certificationService.link,
                home: 'http://certs.unal.edu.co',
                hash: certificationService.hash,
              },
              {
                qrCode: buffers[0],
                Pdf: buffers[1],
              },
            ));
        })
        .then(certificationEmail => {
          expect(certificationEmail.html).to.have.string('Estimado / Estimada John Doe');
          expect(certificationEmail.html).to.have.string('certificado de aprobación del curso Curso dummy.');
        })
    });
    it('should send the email to the student from the CertificationEmail', () => {
      return eventualCertificationService
        .then(certificationService => certificationService.certify())
        .then(result => {
          expect(result).to.be.an('Object');
          expect(result.ipfsHash).to.match(/\w{46}/);
          expect(result.txHash).to.match(/0x[a-f0-9]{64}/);
        })
    });
  });
  describe('Validating certifications', () => {
    const studentId = 'CC123';
    const studentName = 'John Doe';
    const courseName = 'Curso dummy';
    const courseIntensity = '45';
    const courseStartDate = '2019-01-01';
    const courseFinishDate = '2019-02-01';
    const eventualCertificationServiceResults = CertificationService.create({
      studentId,
      studentName,
      studentEmail: 'amrendonsa+mailer@unal.edu.co',
      courseId: '321',
      courseName,
      courseIntensity,
      courseStartDate,
      courseFinishDate,
    })
      .then(certificationService => Promise.all([
        certificationService.certify(),
        certificationService.eventualPdfBuffer,
        certificationService.hash,
      ]));
    it('should get a pdf and validate authenticity', () => {
      return eventualCertificationServiceResults
        .then(promises => {
          const [certificationInfo, pdfBuffer, linkHash] = promises;
          return CertificationService.validatePdf(pdfBuffer)
        })
        .then(result => {
          expect(result).to.be.an('Object');
          expect(result).to.have.all.keys('studentId', 'studentName', 'courseIntensity', 'courseName', 'courseStartDate', 'courseFinishDate');
          expect(result.studentId).to.eq(studentId);
          expect(result.studentName).to.eq(studentName);
          expect(result.courseName).to.eq(courseName);
          expect(result.courseIntensity).to.eq(courseIntensity);
          expect(result.courseStartDate).to.eq(courseStartDate);
          expect(result.courseFinishDate).to.eq(courseFinishDate);
        });
    });
    it('should get a hash and validate authenticity', () => {
      return eventualCertificationServiceResults
        .then(promises => {
          const [certificationInfo, pdfBuffer, linkHash] = promises;
          return CertificationService.validateIPFSHash(certificationInfo.ipfsHash);
        })
        .then(result => {
          expect(result).to.be.an('Object');
          expect(result).to.have.all.keys('studentId', 'studentName', 'courseName', 'courseIntensity', 'courseStartDate', 'courseFinishDate');
          expect(result.studentId).to.eq(studentId);
          expect(result.studentName).to.eq(studentName);
          expect(result.courseName).to.eq(courseName);
          expect(result.courseIntensity).to.eq(courseIntensity);
          expect(result.courseStartDate).to.eq(courseStartDate);
          expect(result.courseFinishDate).to.eq(courseFinishDate);
        });
    });
    it('should get a link hash and validate authenticity', () => {
      return eventualCertificationServiceResults
        .then(promises => {
          const [certificationInfo, pdfBuffer, linkHash] = promises;
          return CertificationService.validateLinkHash(linkHash);
        })
        .then(result => {
          expect(result).to.be.an('Object');
          expect(result).to.have.all.keys('studentId', 'studentName', 'courseName', 'courseIntensity', 'courseStartDate', 'courseFinishDate');
          expect(result.studentId).to.eq(studentId);
          expect(result.studentName).to.eq(studentName);
          expect(result.courseName).to.eq(courseName);
          expect(result.courseIntensity).to.eq(courseIntensity);
          expect(result.courseStartDate).to.eq(courseStartDate);
          expect(result.courseFinishDate).to.eq(courseFinishDate);
        });
    });
    it('should fail when an invalid ipfs hash is used', () => {
      return CertificationService.validateIPFSHash('guachuguachu')
        .catch(result => {
          expect(result).to.be.an('Object');
          expect(result).to.have.all.keys('error', 'code', 'msg', 'detailed');
          expect(result.code).to.eq(404);
          expect(result.detailed).to.eq('Certificate not found');
        });
    });
    it('should fail when an invalid link is used', () => {
      return CertificationService.validateLinkHash('asdjasjd09123')
        .catch(result => {
          expect(result).to.be.an('Object');
          expect(result).to.have.all.keys('error', 'code', 'msg', 'detailed');
          expect(result.code).to.eq(404);
          expect(result.detailed).to.eq('Certificate not found');
        });
    });
  });
});
