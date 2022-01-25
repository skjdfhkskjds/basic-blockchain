const Transaction = ({ transaction }) => {
  return (
    <div className={`transaction ${transaction.reminder ? 'reminder' : ''}`} >
        <h3>{transaction.transaction}</h3>
        <p>{transaction.id}</p>
    </div>
  )
};

export default Transaction;
