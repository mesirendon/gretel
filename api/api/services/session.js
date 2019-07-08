import {config} from 'dotenv';
import {error, errors} from '../helpers/error'
import jwt from '../helpers/jwt';

config();

/**
 * Login a user upon login credentials
 * @param email User's email
 * @param password User's password
 * @returns {Promise<String|Error>} Encoded JWT token.
 */
const login = (email, password) => new Promise((resolve, reject) => {
  if (email !== process.env.emailIEI || password !== process.env.passwordIEI)
    reject(error(errors.UNAUTHORIZED, 'Either the email or the password are wrong'));
  resolve(jwt.build(email));
});

/**
 * Checks if a given token is valid.
 * @param {String} token Token to verify
 * @return {Promise<JWTSession|CustomError>}
 */
const checkToken = token => new Promise((resolve, reject) => {
  let verification = jwt.verify(token);
  if (verification instanceof Error) {
    reject(error(errors.UNAUTHORIZED, verification.message));
  }
  resolve(verification);
});

export default {
  login,
  checkToken,
}
