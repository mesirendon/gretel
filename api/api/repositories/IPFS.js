import fileType from 'file-type';
import {ipfs} from '../helpers/IPFS';

require('dotenv').config();

/**
 * @typedef {Object} IPFSResponse
 * @property {String} hash Resulting Buffer's hash
 * @property {String} name Buffer name
 */
/**
 * Saves a Buffer into the specified IPFS network
 * @param {Buffer} buffer - The buffer to save into IPFS
 * @param {Boolean} validate - Determines if the add function uploads the file (default), or only gets the document IPFS hash
 * @returns {Promise<IPFSResponse>} An object with the IPFS hash and
 * the uploaded file name.
 */
const add = (buffer, validate = false) => new Promise((resolve, reject) => {
  if (!(buffer instanceof Buffer)) reject(new Error('Not a buffer'));
  const options = {
    pin: process.env.pin || false
  };
  if (validate) options['onlyHash'] = true;
  ipfs.add(buffer, options, (err, response) => {
    if (err) reject(err);
    const {hash} = response[0];
    const name = buffer.originalname;
    resolve({hash, name});
  });
});

/**
 * Gets the binary file by its hash
 * @param hash IPFS hash
 * @returns {Promise<{type: 'MIME_TYPE', content: 'BUFFER'}>}
 */
const get = hash => new Promise((resolve, reject) => {
  ipfs.cat(hash, (err, response) => {
    if (err) reject(err);
    const type = fileType(response);
    resolve({type, content: response});
  });
});

export default {
  add,
  get,
}
