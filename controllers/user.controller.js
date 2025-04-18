const db = require("../db");

// Register a new user
exports.registerUser = async (req, res) => {
  const { wallet_address, email, full_name } = req.body;

  if (!wallet_address) return res.status(400).send("Wallet address required");

  try {
    const [rows] = await db.query(
      "INSERT INTO user_BC (wallet_address, email, full_name) VALUES (?, ?, ?)",
      [wallet_address, email, full_name]
    );

    // Get the inserted user's ID
    const userId = rows.insertId;

    // Optionally, fetch the full user record if needed
    const [user] = await db.query("SELECT * FROM user_BC WHERE id = ?", [userId]);

    res.status(201).json(user[0]);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).send("User already exists");
    }
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get user profile by wallet
exports.getUserProfile = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    // Query by wallet_address instead of user_id
    const [userRes] = await db.query(
      `SELECT * FROM user_bc WHERE wallet_address = ?`,
      [walletAddress.toLowerCase()]  // Ensure the wallet address is in lower case to avoid case sensitivity issues
    );

    if (!userRes.length) return res.status(404).send("User not found");

    // Get investments for the user
    const [investmentsRes] = await db.query(
      `SELECT * FROM investments WHERE user_address = ? ORDER BY created_at DESC`,
      [walletAddress.toLowerCase()]
    );

    // Get rent payouts for the user
    const [paymentsRes] = await db.query(
      `SELECT * FROM rent_distributions WHERE user_address = ? ORDER BY created_at DESC`,
      [walletAddress.toLowerCase()]
    );

    res.json({
      user: userRes[0],
      investments: investmentsRes,
      rent_history: paymentsRes
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).send("Error fetching user profile");
  }
};