import {expect} from '../base';
import QRcoder from '../../api/helpers/qrcode';

describe('Helper: QRCode', () => {
  it('should receive a text and return a eventualPdfBuffer that is not empty', () => {
    const text = 'testing';
    return QRcoder.encode(text).then((buffer) => {
      expect(buffer instanceof Buffer).to.true;
      expect(buffer).to.not.be.empty;
    });
  });
});
