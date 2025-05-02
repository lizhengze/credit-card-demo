import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
    fetchTransactions();

    const intervalId = setInterval(() => {
      fetchSubmissions();
      fetchTransactions();
    }, 5000); // refresh every 5 seconds

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/submissions");
      setSubmissions(response.data);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };


    const deleteTransaction = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
        if (!confirmDelete) return; // If user cancels, do nothing

        try {
        await axios.delete(`http://localhost:4000/transactions/${id}`);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        } catch (error) {
        console.error("Failed to delete transaction:", error);
        }
    };


    const deleteSubmission = async (id) => {
        if (!window.confirm("Are you sure you want to delete this submission?")) return;
        try {
          await axios.delete(`http://localhost:4000/submissions/${id}`);
          setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
        } catch (error) {
          console.error("Failed to delete submission:", error);
        }
      };


  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Submissions Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">User Submissions</h2>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Selected Features</th>
              <th className="p-2 border">Submitted At</th>
              {/* <th className="p-2 border">Actions</th> */}
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>


        <tbody>
        {submissions.map((sub) => (
            <tr key={sub.id} className="border-t">
            <td className="p-2 border">{sub.email}</td>

            <td className="p-2 border">
            {(() => {
                try {
                console.log("selectedFeatures value:", sub.selectedFeatures);
                const features = typeof sub.selectedFeatures === "string"
                  ? JSON.parse(sub.selectedFeatures)
                  : sub.selectedFeatures || {};
                const enabled = Object.entries(features)
                  .filter(([_, value]) => value)
                  .map(([feature]) => feature);
                return enabled.length > 0 ? enabled.join(", ") : "None selected";
                } catch (e) {
                console.error("Failed to parse selectedFeatures:", sub.selectedFeatures, e);
                return "Invalid data";
                }
            })()}
            </td>
            <td className="p-2 border">
              {sub.submittedAt && !isNaN(new Date(sub.submittedAt).getTime())
                ? new Date(sub.submittedAt).toLocaleString()
                : "Invalid date"}
            </td>


            <td className="p-2 border text-center">
            <button
            onClick={() => deleteSubmission(sub.id)}
            className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition"
            >
            Delete
            </button>
            </td>
            </tr>
        ))}
        </tbody>


        </table>
      </section>

      {/* Transactions Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Rewards</th>
              <th className="p-2 border">Fee</th>
              <th className="p-2 border">Transaction Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="p-2 border">{tx.email}</td>
                <td className="p-2 border">${Number(tx.amount).toFixed(2)}</td>
                <td className="p-2 border">{tx.description}</td>
                <td className="p-2 border">${Number(tx.rewards).toFixed(2)}</td>
                <td className="p-2 border">${Number(tx.fee).toFixed(2)}</td>
                <td className="p-2 border">
                  {tx.transactionDate && !isNaN(new Date(tx.transactionDate).getTime())
                    ? new Date(tx.transactionDate).toLocaleString()
                    : "Invalid date"}
                </td>

                <td className="p-2 border text-center">
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                  >
                    Delete
                  </button>
                  {/* For future: you can add an Edit button here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}