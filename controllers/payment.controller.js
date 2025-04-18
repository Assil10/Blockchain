const paymee = require("../services/paymee.service");
const blockchain = require("../blockchain/investment");
const db = require("../db");

// Create a payment and save the payment details to the database
exports.createPayment = async (req, res) => {
  const { projectId, userAddress, amount } = req.body;

  try {
    // Create payment session via Paymee
    const payment = await paymee.createPayment({
      amount,
      note: `Investment in project ${projectId}`
    });

    // Save payment details in the database
    const [result] = await db.query(
      "INSERT INTO payments (paymee_ref, user_address, project_id, amount, status) VALUES (?, ?, ?, ?, ?)",
      [payment.reference, userAddress, projectId, amount, "pending"]
    );

    // Send back the payment URL to complete the payment
    res.json({ payment_url: payment.payment_url });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).send("Error creating payment");
  }
};

// Handle Paymee callback and record investment on blockchain if payment is successful
exports.handleCallback = async (req, res) => {
  const { status, reference, amount } = req.body;

  if (status !== "paid") {
    return res.status(400).send("Payment not confirmed");
  }

  try {
    // Step 1: Find the investment record using the Paymee reference (paymee_ref)
    const [investment] = await db.query(
      "SELECT * FROM investments WHERE paymee_ref = ?",
      [reference]
    );

    if (!investment.length) {
      return res.status(404).send("Investment not found");
    }

    // Step 2: Normalize the amounts to avoid floating-point precision issues
    const investmentAmount = parseFloat(investment[0].amount);  // Ensure it's a number
    const paymeeAmount = parseFloat(amount);  // Ensure the Paymee amount is a number

    console.log(`Comparing amounts: DB(${investmentAmount}) vs Paymee(${paymeeAmount})`);

    // Step 3: Ensure the amount from Paymee matches the investment amount
    if (investmentAmount !== paymeeAmount) {
      console.log("Amount mismatch detected.");
      return res.status(400).send(`Payment amount mismatch: DB(${investmentAmount}) != Paymee(${paymeeAmount})`);
    }

    // Step 4: Update the investment status to "confirmed"
    await db.query(
      "UPDATE investments SET status = 'confirmed' WHERE paymee_ref = ?",
      [reference]
    );

    // Step 5: Update the project's current_amount after confirming the investment
    const [project] = await db.query(
      "SELECT current_amount, goal_amount FROM projects WHERE id = ?",
      [investment[0].project_id]
    );

    if (project.length > 0) {
      // Step 5a: Add the confirmed investment amount to the project's current_amount
      let newCurrentAmount = parseFloat(project[0].current_amount) + investmentAmount;  // Ensure both are numbers

      // Step 5b: Check if newCurrentAmount is NaN before continuing
      if (isNaN(newCurrentAmount)) {
        console.log("Invalid number for newCurrentAmount:", newCurrentAmount);
        return res.status(400).send("Error: Invalid current amount calculation.");
      }

      // Step 5c: Round the value only when saving to the database
      newCurrentAmount = newCurrentAmount.toFixed(2);  // Round to 2 decimal places for storage

      console.log(`New current amount for project ${investment[0].project_id}:`, newCurrentAmount);

      // Step 6: Update the project's current_amount in the database
      await db.query(
        "UPDATE projects SET current_amount = ? WHERE id = ?",
        [newCurrentAmount, investment[0].project_id]
      );

      // Step 7: Check if the project has reached its goal amount and update the status to 'Funded'
      if (parseFloat(newCurrentAmount) >= project[0].goal_amount) {
        await db.query(
          "UPDATE projects SET status = 'Funded' WHERE id = ?",
          [investment[0].project_id]
        );
      }
    }

    // Step 8: Record the investment on the blockchain (Ethereum)
    const txHash = await blockchain.recordInvestment(
      investment[0].project_id,
      investment[0].user_address,
      investment[0].amount / 100  // Divide by 100 to return to original amount for blockchain
    );

    // Step 9: Save the txHash in the investments table
    await db.query(
      "UPDATE investments SET tx_hash = ? WHERE paymee_ref = ?",
      [txHash, reference]  // Save txHash for the corresponding investment
    );

    // Step 10: Respond with the success message and transaction hash
    res.status(200).send({ message: "Payment confirmed and investment recorded", txHash });

  } catch (error) {
    console.error("Error handling Paymee callback:", error);
    res.status(500).send("Error processing payment callback");
  }
};



// Get payment status by reference
exports.getPaymentStatusByRef = async (req, res) => {
  const { ref } = req.params;

  try {
    // Fetch the payment details from the database using the reference
    const [result] = await db.query(
      "SELECT * FROM payments WHERE paymee_ref = ?",
      [ref]
    );

    if (result.length === 0) return res.status(404).send("Payment not found");

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).send("Error fetching payment status");
  }
};

// Get all payments by wallet address
exports.getPaymentsByWallet = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    // Fetch all payments made by the specified wallet address
    const [result] = await db.query(
      "SELECT * FROM payments WHERE user_address = ? ORDER BY created_at DESC",
      [walletAddress.toLowerCase()]
    );

    if (result.length === 0) return res.status(404).send("No payments found");

    res.json(result);
  } catch (error) {
    console.error("Error fetching payments by wallet:", error);
    res.status(500).send("Error fetching payments");
  }
};
