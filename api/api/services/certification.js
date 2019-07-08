import {error, errors} from '../helpers/error';
import QRcoder from '../helpers/qrcode';
import Pdf from '../helpers/pdfBuilder';
import IPFS from '../repositories/IPFS';
import {Certificate} from '../repositories/SmartContract';
import CertificationEmail from '../repositories/email/CertificationEmail';
import HtmlMailStyler from 'html-mail-styler';
import Mailer from '../helpers/Mailer';
import nodemailer from 'nodemailer';
import moment from "moment";

require('dotenv').config();

class CertificationService {
  constructor(
    studentId,
    studentName,
    studentEmail,
    courseId,
    courseName,
    courseIntensity,
    courseStartDate,
    courseFinishDate,
  ) {
    this.studentId = studentId;
    this.studentName = studentName;
    this.studentEmail = studentEmail;
    this.courseId = courseId;
    this.courseName = courseName;
    this.courseIntensity = courseIntensity;
    this.courseStartDate = courseStartDate;
    this.courseFinishDate = courseFinishDate;
    const data = [
      studentId,
      studentName,
      studentEmail,
      courseId,
      courseName,
      courseIntensity,
      courseStartDate,
      courseFinishDate,
    ].join();
    this.hash = require('crypto').createHash('sha256').update(data).digest('hex');
    this.link = `http://${process.env.DOMAIN}/?code=${this.hash}`;
    this.eventualQrcodeBuffer = QRcoder.encode(this.link);
    this.eventualPdfBuffer = this.eventualQrcodeBuffer
      .then(qrcodeBuffer => Pdf.create(
        {
          studentId: this.studentId,
          studentName: this.studentName,
          courseName: this.courseName,
          courseIntensity: this.courseIntensity,
          courseStartDate: this.courseStartDate,
          courseFinishDate: this.courseFinishDate,
          courseDeliveredDate:moment().format("YYYY-MM-DD"),
          secretaryName: process.env.secretaryName,
        },
        qrcodeBuffer
      ).eventualPdfBuffer)
      .catch(e => new Error(e));
  }

  /**
   * @typedef {Object} CertificationInfo.
   * @property {String} ipfsHash IPFS hash code.
   * @property {String} txHash Blockchain confirmation transaction hash code.
   */
  /**
   * Triggers the certification process. This includes getting qrcode and pdf buffers, sending the
   * pdf buffer to IPFS, sending metadata to the SmartContract.
   * @return {Promise<CertificationInfo>}
   */
  certify() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.eventualQrcodeBuffer,
        this.eventualPdfBuffer,
      ])
        .then(buffers => {
          const [qrCodeBuffer, pdfBuffer] = buffers;
          return CertificationService.sendCertificationPdfBufferToIPFS(pdfBuffer)
            .then(ipfsResponse => {
              return {
                qrCodeBuffer,
                pdfBuffer,
                ...ipfsResponse,
              }
            })
        })
        .then(promises => {
          return CertificationService.sendCertificationInformationToSmartContract(
            this.studentId,
            this.studentName,
            this.studentEmail,
            this.courseId,
            this.courseName,
            this.courseIntensity,
            this.courseStartDate,
            this.courseFinishDate,
            promises.hash,
            this.hash,
          )
            .then(txHash => {
              return {
                txHash,
                ...promises,
              }
            })
        })
        .then(emailParams => {
            return {
              email: CertificationEmail.create(
                new HtmlMailStyler(),
                this.studentEmail,
                {
                  name: this.studentName,
                  courseName: this.courseName,
                  link: this.link,
                  home: process.env.home || 'http://certificados.bogota.unal.edu.co',
                  hash: emailParams.hash,
                },
                {
                  qrCode: emailParams.qrCodeBuffer,
                  Pdf: emailParams.pdfBuffer,
                },
              ),
              ...emailParams,
            }
          }
        )
        .then(email => {
          return Mailer.create(nodemailer, email.email).sendMail()
            .then(result => {
              return {
                mailerResult: result,
                ...email,
              }
            })
        })
        .then(result => {
          resolve({
            ipfsHash: result.hash,
            txHash: result.txHash,
          });
        })
        .catch(e => {
          reject(error(errors.INTERNAL_SERVER_ERROR, e));
        })
    });
  }

  /**
   * Gets an eventual instance of the CertificationService.
   * @param data <Object> Certification data for the specified student.
   * @param data.studentId <String> Student ID.
   * @param data.studentName <String> Student name.
   * @param data.studentEmail <String> Student email.
   * @param data.courseId <String> Course ID.
   * @param data.courseName <String> Course name.
   * @param data.courseIntensity <String> Course hour intensity.
   * @param data.courseStartDate <String> Course starting date.
   * @param data.courseFinishDate <String> Course finishing date.
   * @returns {Promise<CertificationService|Error>}
   */
  static create(data) {
    return new Promise((resolve, reject) => {
      const {
        studentId,
        studentName,
        studentEmail,
        courseId,
        courseName,
        courseIntensity,
        courseStartDate,
        courseFinishDate,
      } = data;
      const missingParameters = [];
      if (!studentId) missingParameters.push('Student ID');
      if (!studentName) missingParameters.push('Student name');
      if (!studentEmail) missingParameters.push('Student email');
      if (!courseId) missingParameters.push('Course ID');
      if (!courseName) missingParameters.push('Course name');
      if (!courseIntensity) missingParameters.push('Course intensity');
      if (!courseStartDate) missingParameters.push('Course starting date');
      if (!courseFinishDate) missingParameters.push('Course finish date');
      if (missingParameters.length) reject(error(errors.BAD_REQUEST, `Missing parameters: ${missingParameters.join()}`));
      resolve(new CertificationService(
        studentId,
        studentName,
        studentEmail,
        courseId,
        courseName,
        courseIntensity,
        courseStartDate,
        courseFinishDate,
      ));
    })
  }

  /**
   * Sends the specified buffer to the configured IPFS ntework.
   * @param {Buffer} pdfBuffer The Buffer to send to the IPFS network.
   * @return {Promise<IPFSResponse>}
   */
  static sendCertificationPdfBufferToIPFS(pdfBuffer) {
    return IPFS.add(pdfBuffer);
  }

  /**
   * Sends the specified data to the SmartContract an gets the operation transaction hash
   * @param {String} studentId Student ID
   * @param {String} studentName Student name
   * @param {String} studentEmail Strudent email
   * @param {String} courseId Course ID
   * @param {String} courseName Course name
   * @param {String} courseIntensity Course hour intensity
   * @param {String} courseStartDate Course starting date
   * @param {String} courseFinishDate Course finishing date
   * @param {String} ipfsHash PDF Buffer hash gotten from IPFS
   * @param {String} linkHash Self calculated link hash
   * @return {Promise<String|Error>}
   */
  static sendCertificationInformationToSmartContract(
    studentId,
    studentName,
    studentEmail,
    courseId,
    courseName,
    courseIntensity,
    courseStartDate,
    courseFinishDate,
    ipfsHash,
    linkHash,
  ) {
    return new Promise((resolve, reject) => {
      Certificate.init()
        .then(() => Certificate.post(
          'certify',
          studentId,
          studentName,
          studentEmail,
          courseId,
          courseName,
          courseIntensity,
          courseStartDate,
          courseFinishDate,
          ipfsHash.substr(0, 32),
          ipfsHash.substr(32),
          linkHash.substr(0, 32),
          linkHash.substr(32),
        ))
        .then(resolve)
        .catch(e => {
          reject(new Error(e));
        });
    });
  }

  static validatePdf(pdfBuffer) {
    return new Promise((resolve, reject) => {
      IPFS.add(pdfBuffer, true)
        .then(ipfsResponse => CertificationService.validateIPFSHash(ipfsResponse.hash))
        .then(resolve)
        .catch(reject);
    });
  }

  static validateIPFSHash(ipfsHash) {
    return new Promise((resolve, reject) => {
      Certificate.init()
        .then(() => Certificate.get(
          'verifyByIPFS',
          ipfsHash.substr(0, 32),
          ipfsHash.substr(32),
          )
        )
        .then(certificationInfo => {
          if (!!certificationInfo['0'])
            resolve({
              studentId: certificationInfo['0'],
              studentName: certificationInfo['1'],
              courseName: certificationInfo['2'],
              courseIntensity: certificationInfo['3'],
              courseStartDate: certificationInfo['4'],
              courseFinishDate: certificationInfo['5'],
            });
          reject(error(errors.NOT_FOUND, 'Certificate not found'));
        })
        .catch(e => {
          reject(error(errors.INTERNAL_SERVER_ERROR, e));
        });
    });
  }

  static validateLinkHash(linkHash) {
    return new Promise((resolve, reject) => {
      Certificate.init()
        .then(() => Certificate.get(
          'verifyByLink',
          linkHash.substr(0, 32),
          linkHash.substr(32),
          )
        )
        .then(certificationInfo => {
          if (!!certificationInfo['0'])
            resolve({
              studentId: certificationInfo['0'],
              studentName: certificationInfo['1'],
              courseName: certificationInfo['2'],
              courseIntensity: certificationInfo['3'],
              courseStartDate: certificationInfo['4'],
              courseFinishDate: certificationInfo['5'],
            });
          reject(error(errors.NOT_FOUND, 'Certificate not found'));
        })
        .catch(e => {
          reject(error(errors.INTERNAL_SERVER_ERROR, e));
        });
    });
  }

  get [Symbol.toStringTag]() {
    return 'CertificationService';
  };
}

module.exports = CertificationService;
