import { useState } from "react";
import Header from "./components/Header";
import Transactions from "./components/Transactions";
import AddTransaction from "./components/AddTransaction";
import generateKey from "./blockchain-logic/keygeneration";
const {Blockchain, Transaction, Block} = require('./blockchain-logic/blockchain');

function App() {
  const EC = require("elliptic").ec;
  const ec = new EC("secp256k1");
  
  const [showAddTransactions, setShowAddTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const jsCoin = new Blockchain();

  // Add Transaction
  const addTransactions = (transaction) => {
    const id = createTransaction(transaction);
    const newTransaction = { id, ...transaction };
    setTransactions([...transactions, newTransaction]);
    // console.log(JSON.stringify(jsCoin, null, 4));
  };

  // Creates a transaction
  const createTransaction = (transaction) => {
    const myKey = ec.keyFromPrivate(transaction.sender);
    const myWalletAddress = myKey.getPublic("hex");

    const tx = new Transaction(myWalletAddress, transaction.recipient, transaction.amount);
    tx.signTransaction(myKey);
    jsCoin.addTransaction(tx);

    if (transaction.mine) {
      jsCoin.minePendingTransactions(myWalletAddress);
    }

    const newBlock = new Block(Date.now(), tx, '')
    jsCoin.addBlock(newBlock);
    console.log(jsCoin)

    return newBlock.calculateHash();
  }

  return (
    <div className="container">
      <Header
        onAdd={() => setShowAddTransactions(!showAddTransactions)}
        onKey={() => generateKey()}
        showAdd={showAddTransactions}
      />
      {/* && Shorter ternary operator to be used without an else statement */}
      {showAddTransactions && <AddTransaction onAdd={addTransactions} />}
      {transactions.length > 0 ? (
        <Transactions
          transactions={transactions}
        />
      ) : (
        "No Transactions to Show"
      )}
    </div>
  );
}

export default App;
