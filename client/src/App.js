import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [allTransactions, setAllTransactions] = useState(null);
  const [item, SetItem] = useState("");
  const [price, SetPrice] = useState(0);

  useEffect(() => getAllTrans(), [allTransactions]);

  const getAllTrans = () => {
    axios
      .get("http://localhost:5000/transactions")
      .then((res) => {
        setAllTransactions(res.data);
      })
      .catch((error) => console.log(error));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/transactions", {
        item,
        price,
        record_time: new Date(),
      })
      .catch((error) => console.log(error));
    clearInput();
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/transactions/${id}`)
      .catch((error) => console.log(error));
  };

  const calcSum = () => {
    var ans = 0;
    if (allTransactions && allTransactions.length > 0) {
      for (var trans of allTransactions) {
        ans += trans.price;
      }
    }
    return ans.toFixed(2);
  };

  const clearInput = () => {
    SetItem("");
    SetPrice(0);
  };
  return (
    <div>
      <h1 className="title">Expense management tracker</h1>
      <div className="addRow">
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>Item: </label>
          <input
            type="text"
            value={item}
            required
            onChange={(e) => SetItem(e.target.value)}
          ></input>
          <label>Price: </label>
          <input
            type="number"
            value={price}
            required
            onChange={(e) => SetPrice(e.target.value)}
          ></input>
          <button>+</button>
        </form>
      </div>
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Record Time</th>
              <th>···</th>
            </tr>
          </thead>
          <tbody>
            {allTransactions?.length > 0 &&
              allTransactions.map((transaction) => {
                return (
                  <tr key={transaction.trans_id}>
                    <td>{transaction.item}</td>
                    <td>{transaction.price} €</td>
                    <td>{transaction.record_time.split("T")[0]}</td>
                    <td>
                      <button
                        className="deleteButton"
                        onClick={() => handleDelete(transaction.trans_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="sumRow">Sum: {calcSum()} €</div>
    </div>
  );
}

export default App;
