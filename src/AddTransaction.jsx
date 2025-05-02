import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AddTransaction() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("purchase");
  const [selectedFeatures, setSelectedFeatures] = useState({
    cashback: true, // Assume user has cashback by default for now
    travelPoints: false,
    purchaseProtection: false,
    travelInsurance: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !amount || !description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:4000/transaction", {
        email,
        amount: parseFloat(amount),
        description,
        type,
        selectedFeatures,
      });

      alert("Transaction added successfully!");
      setEmail("");
      setAmount("");
      setDescription("");
      setType("purchase");
    } catch (error) {
      console.error("Failed to add transaction:", error);
      alert("Failed to add transaction.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">


      <h1 className="text-2xl font-bold text-center mb-6">Add Transaction</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Customer Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="purchase">Purchase</option>
          <option value="payment">Payment</option>
          <option value="fee">Fee</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}