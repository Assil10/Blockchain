const db = require("../db");

// Admin: distribute rent (simulate payouts)
exports.distributeRent = async (req, res) => {
  const { projectId, investors, totalRent } = req.body;

  // Validate incoming data
  if (!projectId || !investors || !totalRent) {
    return res.status(400).send("Missing required fields: projectId, investors, or totalRent");
  }

  try {
    let totalInvested = 0;
    let rentDistributions = [];

    // Step 1: Calculate the total invested amount for the project
    for (let i = 0; i < investors.length; i++) {
      const [investment] = await db.query(
        "SELECT amount FROM investments WHERE project_id = ? AND user_address = ?",
        [projectId, investors[i]]
      );

      console.log(`Investment data for ${investors[i]}:`, investment);

      // Ensure that the amount is a valid number and not null/undefined
      if (investment.length > 0 && investment[0].amount !== null && investment[0].amount !== undefined) {
        // Convert the amount to a float number to handle arithmetic correctly
        const investmentAmount = parseFloat(investment[0].amount);

        // If the conversion fails (e.g., if amount is a string that can't be parsed), skip the investment
        if (isNaN(investmentAmount)) {
          console.log(`Invalid investment amount for ${investors[i]}:`, investment[0].amount);
          continue;  // Skip this investor
        }

        totalInvested += investmentAmount;
      } else {
        console.log(`No valid investment found for ${investors[i]}`);
      }
    }

    console.log("Total Invested:", totalInvested);

    if (totalInvested === 0) {
      return res.status(400).send("No valid investments found for the project.");
    }

    // Step 2: Distribute rent based on the proportion of investment
    for (let i = 0; i < investors.length; i++) {
      const [investment] = await db.query(
        "SELECT amount FROM investments WHERE project_id = ? AND user_address = ?",
        [projectId, investors[i]]
      );

      console.log(`Investment data for ${investors[i]}:`, investment);

      if (investment.length > 0 && investment[0].amount !== null && investment[0].amount !== undefined) {
        const investmentAmount = parseFloat(investment[0].amount);

        if (isNaN(investmentAmount)) {
          console.log(`Invalid investment amount for ${investors[i]}:`, investment[0].amount);
          continue;  // Skip this investor if their amount is invalid
        }

        // Calculate the share of rent based on the proportion of total investment
        const share = (investmentAmount / totalInvested) * totalRent;
        rentDistributions.push({
          investor: investors[i],
          projectId: projectId,
          share: share
        });

        console.log(`Rent share for ${investors[i]}:`, share);

        // Step 3: Insert the rent distribution into the database
        await db.query(
          "INSERT INTO rent_distributions (project_id, user_address, amount) VALUES (?, ?, ?)",
          [projectId, investors[i], share]
        );
      } else {
        console.log(`Skipping rent distribution for ${investors[i]}: No valid investment found`);
      }
    }

    // Step 4: Return the rent distribution results
    res.status(200).json({
      message: "Rent distributed successfully",
      distributions: rentDistributions
    });
  } catch (error) {
    console.error("Error distributing rent:", error);
    res.status(500).send("Error distributing rent");
  }
};
// Get rent payout history for a user
exports.getRentHistoryByWallet = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    // Fetch rent payouts based on wallet address
    const [result] = await db.query(
      "SELECT * FROM rent_payouts WHERE user_address = ? ORDER BY created_at DESC",
      [walletAddress.toLowerCase()]
    );

    if (result.length === 0) return res.status(404).send("No payouts found");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching rent history");
  }
};

// Get rent payouts by project
exports.getRentByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Fetch rent payouts based on project ID
    const [result] = await db.query(
      "SELECT * FROM rent_payouts WHERE project_id = ? ORDER BY created_at DESC",
      [projectId]
    );

    if (result.length === 0) return res.status(404).send("No payouts found");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching rent payouts by project");
  }
};
