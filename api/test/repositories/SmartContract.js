import {expect} from '../base';
import {Certificate} from '../../api/repositories/SmartContract';

describe('Repository: SmartContract', () => {
  describe('Certificate', () => {
    const params = [
      'CC123',
      'John Doe',
      'a@a.com',
      'C123',
      'Course',
      '45',
      '123',
      '132',
      'a',
      'b',
      'c',
      'd'
    ];
    it('should be initialized', () => {
      return Certificate.init()
        .then(result => {
          expect(result).to.be.true;
        });
    });
    it('should allow to save data using a method of the SmartContract', () => {
      return Certificate.post('certify', ...params)
        .then(result => {
          expect(result).to.match(/0x[a-f0-9]{64}/g);
        });
    });
    it('should allow to read data using a method of the SmartContract', () => {
      return Certificate.get('verifyByIPFS', 'a', 'b')
        .then(result => {
          expect(result).to.be.an('object');
          const [r, s, t, u, v, w, x] = params;
          expect(result['0']).to.eq(r);
          expect(result['1']).to.eq(s);
          expect(result['2']).to.eq(v);
          expect(result['3']).to.eq(w);
          expect(result['4']).to.eq(x);
        })
    });
  });
});
