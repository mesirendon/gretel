import {config} from 'dotenv'
import Tx from 'ethereumjs-tx'
import CertificateContract from '../contracts/Certificates'
import Web3 from 'web3'

config();

const abi = CertificateContract.abi;
const address = process.env.contractAddress;
const mnemonic = process.env.mnemonic;
const privateKey = Buffer.from(mnemonic, 'hex');
const host = process.env.host || 'http://localhost:8545';
const account = process.env.account;
const from = {from: account};

export const Certificate = {
  contract: null,
  web3: null,

  /**
   * Initializes a contract instance to be queried.
   * @returns {Promise<Boolean>} true on success
   */
  init: () => new Promise((resolve, reject) => {
    try {
      console.log(`Host: ${host}`);
      Certificate.web3 = new Web3(new Web3.providers.HttpProvider(host));
      Certificate.contract = new Certificate.web3.eth.Contract(abi, address, Object.assign({gasLimit: 3000000}, from));
      resolve(true)
    } catch (e) {
      console.error(`Init: ${e}`);
      reject(e)
    }
  }),

  /**
   * Post makes calls to the writing contract functions
   * @param functionName The expected contract function to be executed
   * @param params Expected parameters the contract function receives.
   * @returns {Promise<String>} A transaction hash on successful operations.
   */
  post: (functionName, ...params) => new Promise((resolve, reject) => {
    const contractFunction = Certificate.contract.methods[functionName](...params);
    const functionAbi = contractFunction.encodeABI();
    contractFunction.estimateGas(from)
      .then(gas => sign(functionAbi, gas))
      .then(serializedTx => Certificate.web3.eth.sendSignedTransaction(`0x${serializedTx}`))
      .then((tx) => {
        resolve(tx.transactionHash)
      })
      .catch((e) => {
        console.error(`Post(${functionName}): ${e}`);
        reject(e);
      });
  }),

  /**
   * Get makes calls to the only read contract functions
   * @param functionName The expected contract function to be consulted
   * @param params Expected parameters the contract function receives
   * @returns {Promise<any>} A tuple of n-th elements the function returns
   */
  get: (functionName, ...params) => new Promise((resolve, reject) => {
    Certificate.contract.methods[functionName](...params).call({from: account})
      .then(resolve)
      .catch((e) => {
        console.error(`Get(${functionName}): ${e}`);
        reject(e);
      });
  }),
};

const sign = (functionAbi, gasLimit) => new Promise((resolve, reject) => {
  try {
    Certificate.web3.eth.getGasPrice()
      .then(gasPrice => {
        Certificate.web3.eth.getTransactionCount(account)
          .then(nonce => {
            console.log(`Nonce: ${nonce}`);
            const txParams = {
              gasPrice: Certificate.web3.utils.toHex(gasPrice),
              gasLimit,
              to: address,
              data: functionAbi,
              from: account,
              nonce
            };
            const tx = new Tx(txParams);
            tx.sign(privateKey);
            resolve(tx.serialize().toString('hex'))
          })
          .catch(reject)
      })
      .catch(reject)
  } catch (e) {
    reject(e)
  }
});
