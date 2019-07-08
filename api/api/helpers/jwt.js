import {config} from 'dotenv';
import jwt from 'jsonwebtoken';

config();
/**
 * @typedef {Object} JWTSession
 * @property {String} email Email related to the token
 * @property {String} iat Timestamp of token issuing date and time
 * @property {String} exp Timestamp of token expiration date and time
 */
/**
 * Builds a JWT with the email sent and an expiration of a week
 * @param email User's email
 * @returns String Decoded JWT token
 */
const build = email => jwt.sign(
  {email},
  process.env.mnemonic,
  {expiresIn: '1w'}
);

/**
 * Verifies the authenticity of a given token.
 * @param {String} token
 * @return {JWTSession|Error}
 */
const verify = token => {
  const decode = jwt.decode(token, process.env.mnemonic);
  if (decode) return decode;
  return new Error('Invalid token');
};

export default {
  build,
  verify,
}
