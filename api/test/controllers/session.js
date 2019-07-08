import {expect, request} from '../base';

require('dotenv').config();

describe('Controller: Sessions', () => {
  const email = process.env.emailIEI;
  const password = process.env.passwordIEI;
  it('should return a valid token upon valid login credentials', () => {
    return request
      .post('/login')
      .send({email, password})
      .then(result => {
        expect(result).to.have.status(200);
        expect(result.body.token).to.match(/\w*\.\w*\.\w*/);
      })
  });
  it('should return an UNAUTHORIZED error upon invalid login credentials', () => {
    const password = '1223';
    return request
      .post('/login')
      .send({email, password})
      .then((error) => {
        expect(error).to.have.status(401);
        expect(error.body).to.have.all.keys('error', 'msg', 'detailed', 'code');
      })
  });
  it('should return a JWTSession object for a valid token', () => {
    return request
      .post('/login')
      .send({email, password})
      .then(result => result.body)
      .then(token => request.post('/token').send(token))
      .then(result => {
        expect(result).to.have.status(200);
        return result.body;
      })
      .then(jwtSession => {
        expect(jwtSession).to.be.an('Object');
        expect(jwtSession).to.have.all.keys('email', 'iat', 'exp');
        expect(jwtSession.email).to.eq(email);
      });
  });
  it('should return an error for an invalid token', () => {
    return request
      .post('/login')
      .send({email, password})
      .then(result => result.body)
      .then(token => request.post('/token').send({token: token.token.replace(/e/g, 'a')}))
      .then(error => {
        expect(error).to.have.status(401);
        return error.body;
      })
      .then(error => {
        expect(error).to.have.all.keys('error', 'msg', 'detailed', 'code');
        expect(error.detailed).to.eq('Invalid token');
      });
  });
});
