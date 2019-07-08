import {expect, request} from '../base';

require('dotenv').config();

describe('Controller: Certification', () => {
  const email = process.env.emailIEI;
  const password = process.env.passwordIEI;
  const studentId = 'CC 123';
  const studentName = 'John Doe';
  const studentEmail = 'amrendonsa+mailer@unal.edu.co';
  const courseId = '12343234';
  const courseName = 'Dummy things';
  const courseIntensity = '45'
  const courseStartDate = '2019-01-01';
  const courseFinishDate = '2019-02-01';
  describe('Certifying', () => {
    it('should return a UNAUTHORIZED error for missing token in header', () => {
      return request
        .post('/certifications')
        .set('Authorization', '')
        .send({
          studentId,
          studentName,
          studentEmail,
          courseId,
          courseName,
          courseStartDate,
          courseFinishDate,
        })
        .then(error => {
          expect(error).to.have.status(401);
          expect(error.body).to.have.all.keys('error', 'msg', 'detailed', 'code');
          expect(error.body.detailed).to.eq('Missing authentication token');
        })
    });
    it('should return a BAD_REQUEST error upon missing parameters', () => {
      return request
        .post('/login')
        .send({email, password})
        .then(result => result.body.token)
        .then(token => request
          .post('/certifications')
          .set('Authorization', `Bearer ${token}`)
          .send({
            studentId,
            studentName,
            studentEmail,
            courseId,
            courseName,
            courseStartDate,
          })
        )
        .then(error => {
          expect(error).to.have.status(400)
        })
    });
    it('should return the hashes for a successful operation', () => {
      return request
        .post('/login')
        .send({email, password})
        .then(result => result.body.token)
        .then(token => request
          .post('/certifications')
          .set('Authorization', `Bearer ${token}`)
          .send({
            studentId,
            studentName,
            studentEmail,
            courseId,
            courseName,
            courseIntensity,
            courseStartDate,
            courseFinishDate
          })
        )
        .then(result => {
          expect(result).to.have.status(201);
          return result.body
        })
        .then(result => {
          expect(result).to.have.all.keys('txHash', 'ipfsHash');
          expect(result.txHash).to.match(/0x[a-f0-9]{64}/);
          expect(result.ipfsHash).to.match(/\w{46}/);
        })
        .catch(console.error());
    });
  });
});
