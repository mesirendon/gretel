import controllerHelper from '../helpers/controller';
import CertificationService from '../services/certification';
import jwt from '../helpers/jwt';
import {error, errors} from '../helpers/error';

const certify = (req, res) => {
  const certification = req.swagger.params.certification.value;
  const authorization = req.swagger.params.Authorization.value;
  const {
    studentId,
    studentName,
    studentEmail,
    courseId,
    courseName,
    courseIntensity,
    courseStartDate,
    courseFinishDate
  } = certification;
  let auth = authorization.split(' ');
  if (!authorization && auth[0] !== 'Bearer' && jwt.verify(auth[1]) instanceof Error)
    controllerHelper.handleError(error(errors.UNAUTHORIZED, 'Missing authentication token'), res);
  else {
    CertificationService.create({
      studentId,
      studentName,
      studentEmail,
      courseId,
      courseName,
      courseIntensity,
      courseStartDate,
      courseFinishDate
    })
      .then(certificationService => certificationService.certify())
      .then(result => {
        res.status(201).send({...result});
      })
      .catch(e => {
        controllerHelper.handleError(error(errors.INTERNAL_SERVER_ERROR, e), res);
      });
  }
};

const validate = (req, res) => {
  const type = req.swagger.params.type.value;
  const hash = req.swagger.params.hash.value;
  const result = (type === 'ipfs') ? CertificationService.validateIPFSHash(hash) : CertificationService.validateLinkHash(hash);
  result
    .then(info => {
      res.status(200).send(info);
    })
    .catch(e => {
      controllerHelper.handleError(e, res);
    });
};

const validateFile = (req, res) => {
  const pdfBuffer = req.swagger.params.file.value.buffer;
  CertificationService.validatePdf(pdfBuffer)
    .then(info => {
      res.status(200).send(info);
    })
    .catch(e => {
      controllerHelper.handleError(e, res);
    })
};

module.exports = {
  certify,
  validate,
  validateFile,
};
