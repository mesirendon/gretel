import IPFS from 'ipfs-http-client';

export const ipfs = IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
