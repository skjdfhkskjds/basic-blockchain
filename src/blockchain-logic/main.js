const {Blockchain, Transaction, Block} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('48b461daf2c7beac8de5a7b395dafe218fbb92bb6ca917408531562816f8bdc7');
const myWalletAddress = myKey.getPublic('hex');

let jsCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key here', 10);
tx1.signTransaction(myKey);
jsCoin.addTransaction(tx1);

// jsCoin.addBlock(new Block("Second Block", "0"));


console.log('\n Starting the miner...');
jsCoin.minePendingTransactions(myWalletAddress);

console.log('\n Balance of address is', jsCoin.getBalanceOfAddress(myWalletAddress));


// // jsCoin.addBlock(new Block("Third Block", "0"));
// // jsCoin.addBlock(new Block("Fourth Block", "0"));

// jsCoin.chain[1].transactions = 100;
// jsCoin.addBlock(new Block("Fifth Block", "0"));


console.log(JSON.stringify(jsCoin, null, 4));