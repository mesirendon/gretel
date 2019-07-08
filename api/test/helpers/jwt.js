import {expect} from '../base'
import jwt from '../../api/helpers/jwt';

describe('Helper: JWT', () => {
  const email = 'a@a.com';
  let token;
  it('should build a valid token for a given email', () => {
    token = jwt.build(email);
    expect(token).to.match(/\w*\.\w*\.\w*/);
  });
  it('should verify authenticity of a given token', () => {
    const result = jwt.verify(token);
    expect(result).to.be.an('object');
    expect(result).to.have.all.keys('email', 'exp', 'iat');
  });
  it('should verify unauthenticity of a given bad token', () => {
    const result = jwt.verify(token.replace(/e/g, 'd'));
    expect(result).to.be.an('error');
    expect(result.message).to.eq('Invalid token');
  });
});
