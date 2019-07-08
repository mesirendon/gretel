import {expect} from '../base';
import ipfs from '../../api/repositories/IPFS';
import Pdf from '../../api/helpers/pdf';

describe('Repository: IPFS', () => {
  describe('Testing operations on files', () => {
    it('should retrieve the hash of a buffer without saving it', () => {
      return Pdf.create(
        {
          studentId: 'CC123',
          studentName: 'John Doe',
          courseName: 'Course',
          courseIntensity: '45',
          courseStartDate: '2019-01-01',
          courseFinishDate: '2019-02-01'
        }
      ).eventualPdfBuffer
        .then(pdfBuffer => ipfs.add(pdfBuffer, true))
        .then(ipfsResponse => {
          expect(ipfsResponse).to.be.an('Object');
          expect(ipfsResponse.hash).to.match(/[0-9a-zA-Z]{46}/);
        })
    });
  });
});
