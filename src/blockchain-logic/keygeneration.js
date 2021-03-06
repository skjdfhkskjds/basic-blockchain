const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

function generateKey(){
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');

    console.log('Public Key: ' + publicKey + ', Private Key: ' + privateKey);
    return [publicKey, privateKey];
}
