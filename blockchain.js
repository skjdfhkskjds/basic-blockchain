const SHA256 = require("crypto-js/sha256")
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }
    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets.');
        }
        const hash = this.calculateHash();
        const sign = signingKey.sign(hash, 'base64');
        this.signature = sign.toDER('hex');
    }
    isValid() {
        if (this.fromAddress === null) return true;
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction.');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }
    mineBlock(hashDifficulty) {
        while (this.hash.substring(0, hashDifficulty) !== Array(hashDifficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block Mined: " + this.hash);
    }
    hasValidTransactions() {
        for (const transaction of this.transactions) {
            if (!transaction.isValid()) {
                return false;
            }
        }
        return true;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createFirstBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
        this.NewestValidChain = [];
    }
    createFirstBlock() {
        return new Block("01/09/2022", [], "0");
    }
    getNewestBlock() {
        return this.chain[this.chain.length - 1]
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getNewestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        if (this.validChain()) {
            this.chain.push(newBlock);
        }
        else {
            this.rollbackChain();
        }
    }
    minePendingTransactions(minersAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getNewestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined.")
        this.chain.push(block);

        this.pendingTransactions = [new Transaction(null, minersAddress, this.miningReward)]
    }
    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to addresses');
        }
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to the chain.');
        }
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
    }
    validChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (!currentBlock.hasValidTransactions()) {
                return false;
            }
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        this.NewestValidChain = this.chain;
        console.log('validated');
        return true;
    }
    rollbackChain() {
        console.log('rolled back');
        this.chain = this.NewestValidChain;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;