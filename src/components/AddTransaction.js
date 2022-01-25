import { useState } from "react";

const AddTransaction = ({ onAdd }) => {
  const [transaction, setTransaction] = useState("");
  const [amount, setAmount] = useState("");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [mine, setMine] = useState(false);

  const onSubmit = (e) => {
      e.preventDefault()

      if(!transaction || !amount || !sender || !recipient) {
          alert('Please enter all fields')
          return
      }

      onAdd({ transaction, amount, sender, recipient })

      setTransaction('')
      setAmount('')
      setSender('')
      setRecipient('')
      setMine(false)
  }

  return (
    <form className="add-form" onSubmit={onSubmit}>
      <div className="form-control">
        <label>Transaction</label>
        <input type="text" placeholder="Add Transaction" value={transaction} onChange={(e) => setTransaction(e.target.value)} />
      </div>
      <div className="form-control">
        <label>Amount</label>
        <input type="text" placeholder="Add Value of Transaction" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div className="form-control">
        <label>Private Key</label>
        <input type="text" placeholder="Enter your Private Key" value={sender} onChange={(e) => setSender(e.target.value)} />
      </div>
      <div className="form-control">
        <label>Recipient Address</label>
        <input type="text" placeholder="Enter the Recipient's Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      </div>
      <div className="form-control form-control-check">
        <label>Mine Transaction</label>
        <input type="checkbox" checked={mine} value={mine} onChange={(e) => setMine(e.currentTarget.checked)} />
      </div>
      <input type="submit" value="Upload Transaction" className="btn btn-block" />
    </form>
  );
};

export default AddTransaction;
