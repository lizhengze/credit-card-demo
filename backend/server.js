const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;

// const db = require("./db");
const { query } = require("./db");


// Define available transaction types
const transactionTypes = ["purchase", "payment", "fee", "reward"];


app.use(cors());
app.use(express.json());


const features = [
  { key: "cashback", name: "Cashback Rewards", apr: 1.5, fee: 20 },
  { key: "travelPoints", name: "Travel Points", apr: 2.0, fee: 30 },
  { key: "purchaseProtection", name: "Purchase Protection", apr: 1.0, fee: 15 },
  { key: "travelInsurance", name: "Travel Insurance", apr: 2.5, fee: 25 }
];


app.get("/api/features", (req, res) => {
  res.json(features);
});


app.post("/calculate", (req, res) => {
  const { selected } = req.body;

  let baseApr = 15.0;
  let annualFee = 0;

  Object.keys(selected).forEach((key) => {

      if (selected[key]) {
        const feature = features.find(f => f.key === key);
        if (feature) {
          baseApr += feature.apr;
          annualFee += feature.fee;
        }
      }
    });
  // Calculate the APR and fee based on selected features

  res.json({
    apr: baseApr.toFixed(2),
    fee: annualFee
  });
});


app.post("/submit", async (req, res) => {
  const { email, selectedFeatures } = req.body;

  try {
    await query(
      "INSERT INTO submissions (email, selectedFeatures) VALUES ($1, $2)",
      [email, JSON.stringify(selectedFeatures)]
    );
    res.json({ message: "Submission saved successfully" });
  } catch (error) {
    console.error("DB insert failed:", error);
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
});


app.get("/submissions", async (req, res) => {
  try {
    const { rows: submissions } = await query(`
      SELECT id, email, selectedfeatures AS "selectedFeatures", submittedAt AS "submittedAt"
      FROM submissions
      ORDER BY submittedAt DESC
    `);
    res.json(submissions);
    console.log("Submissions:", submissions);
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/submissions/:id", async (req, res) => {
  const { id } = req.params;
  const result = await query("DELETE FROM submissions WHERE id = $1", [id]);
  res.json({ success: true, changes: result.rowCount });

});


app.post("/transaction", async (req, res) => {
  const { email, amount, type, description, selectedFeatures } = req.body;

  if (!email || typeof amount !== "number" || !type || !description || !selectedFeatures) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  let rewards = 0;
  let fee = 0;
  let finalAmount = amount; // can be adjusted depending on type

  if (type === "purchase") {
    if (selectedFeatures.cashback) {
      rewards = +(amount * 0.015).toFixed(2); // 1.5% cashback if enabled
    }
    // You could add more rewards types here in the future.
  } else if (type === "payment") {
    finalAmount = -Math.abs(amount); // Payments are negative amounts (reduce balance)
  } else if (type === "fee") {
    fee = amount; // Fee is positive
    finalAmount = 0; // No amount added to balance (or customize if you want)
  } else {
    return res.status(400).json({ message: "Invalid transaction type." });
  }


  try {
    await query(
      `
      INSERT INTO transactions (email, amount, type, description, rewards, fee, transactionDate)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `,
      [email, finalAmount, type, description, rewards, fee]
    );

    res.json({ message: "Transaction recorded successfully." });
  } catch (error) {
    console.error("Failed to save transaction:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


app.get("/transactions", async (req, res) => {
  try {
    const { rows: transactions } = await query(`
      SELECT id, email, type, amount, description, rewards, fee, transactionDate AS "transactionDate"
      FROM transactions
      ORDER BY transactionDate DESC
    `);
    res.json(transactions);
    console.log("Transactions:", transactions);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.delete("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query("DELETE FROM transactions WHERE id = $1", [id]);

    if (result.rowCount > 0) {
      res.json({ message: "Transaction deleted successfully" });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});


app.put("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, rewards, fee, transactionDate } = req.body;
    const result = await query(
      `
      UPDATE transactions
      SET amount = $1, description = $2, rewards = $3, fee = $4, transactionDate = $5
      WHERE id = $6
      `,
      [amount, description, rewards, fee, transactionDate, id]
    );


    if (result.rowCount > 0) {
      res.json({ message: "Transaction updated successfully" });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    console.error("Failed to update transaction:", error);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});


app.listen(port, () => {
  console.log(`Pricing API running on http://localhost:${port}`);
});