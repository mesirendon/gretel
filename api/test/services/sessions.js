import {expect} from '../base';
import SessionService from '../../api/services/session';

require('dotenv').config();

describe('Service: Sessions', () => {
  describe('Login', () => {
    it('should return a token to an authorized user to login', () => {
      const user = {email: process.env.emailIEI, password: process.env.passwordIEI};
      const result = SessionService.login(user.email, user.password);
      return result
        .then(res => {
          expect(res).to.match(/\w*\.\w*\.\w*/);
        });
    });
    it('should return an UNAUTHORIZED custom error', () => {
      const user = {email: process.env.emailIEI, password: '122'};
      const result = SessionService.login(user.email, user.password);
      return result
        .catch(e => {
          expect(e.code).to.eq(401);
          expect(e.detailed).to.eq('Either the email or the password are wrong');
        });
    });
    it('should get an active token and tell if it is valid', () => {
      const user = {email: process.env.emailIEI, password: process.env.passwordIEI};
      const token = SessionService.login(user.email, user.password);
      return token
        .then(token => SessionService.checkToken(token))
        .then(result => {
          expect(result).to.be.an('Object');
          expect(result).to.have.all.keys('email', 'iat', 'exp');
          expect(result.email).to.eq(user.email);
        });
    });
    it('should get an inactive token and tell it is not valid', () => {
      const user = {email: process.env.emailIEI, password: process.env.passwordIEI};
      const token = SessionService.login(user.email, user.password);
      return token
        .then(token => SessionService.checkToken(token.replace(/e/g, 'a')))
        .catch(error => {
          expect(error).to.be.an('Object');
          expect(error).to.have.all.keys('msg', 'code', 'error', 'detailed');
          expect(error.code).to.eq(401);
          expect(error.detailed).to.eq('Invalid token');
        })
    });
  });
});
