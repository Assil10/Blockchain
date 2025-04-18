const db = require("../db");
const paymee = require("../services/paymee.service");




exports.createInvestment = async (req, res) => {
  const { user_id, project_id, amount, user_address } = req.body;

  if (!user_id || !project_id || !amount || !user_address) {
    return res.status(400).send("Missing required fields");
  }

  try {
    // Step 1: Create an investment record (without confirming payment yet)
    const [result] = await db.query(
      "INSERT INTO investments (user_id, project_id, amount, status, user_address) VALUES (?, ?, ?, ?, ?)",
      [user_id, project_id, amount, "pending", user_address]  // Save user_address
    );

    const investmentId = result.insertId;

    // Step 2: Create Paymee payment session (send user to Paymee to complete the payment)
    const payment = await paymee.createPayment({
      amount,
      note: `Investment in project ${project_id}`,
    });

    console.log("Paymee response:", payment);

    // Step 3: Ensure that the response from Paymee contains both `payment_url` and `paymee_ref`
    const paymeeRef = payment.token; // Paymee token (paymee_ref)
    const paymentUrl = payment.payment_url; // Paymee payment URL

    if (!paymeeRef || !paymentUrl) {
      return res.status(400).send("Error: Missing Paymee data.");
    }

    // Step 4: Save Paymee reference and payment URL in the database
    await db.query(
      "UPDATE investments SET paymee_ref = ?, payment_url = ? WHERE id = ?",
      [paymeeRef, paymentUrl, investmentId]
    );

    // Step 5: Return full investment data, including the Paymee reference and payment URL
    const [investmentData] = await db.query(
      "SELECT id, user_id, project_id, amount, status, paymee_ref, payment_url, user_address FROM investments WHERE id = ?",
      [investmentId]
    );

    res.json(investmentData[0]); // Return the full investment data, including payment_url and paymee_ref

  } catch (error) {
    console.error("Error creating investment:", error);
    res.status(500).send("Error creating investment");
  }
};

// Get all investments (admin)
exports.getAllInvestments = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM investments ORDER BY created_at DESC");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching investments");
  }
};

// Get investments by wallet address
exports.getInvestmentsByWallet = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const [result] = await db.query(
      "SELECT * FROM investments WHERE user_address = ? ORDER BY created_at DESC",
      [walletAddress.toLowerCase()]
    );

    if (result.length === 0) return res.status(404).send("No investments found");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching investments");
  }
};
