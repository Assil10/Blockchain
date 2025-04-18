const { ethers } = require("ethers");
const contractABI = require("../artifacts/contracts/InvestmentManager.sol/InvestmentManager.json").abi;
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_SEPOLIA);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.INVESTMENT_CONTRACT_ADDRESS,
  contractABI,
  wallet
);

exports.recordInvestment = async (projectId, userAddress, amountTND) => {
  try {
    // Convert the amount (in TND) to an integer by multiplying by 100 (cents, for example)
    const amountInCents = Math.round(amountTND * 100); // Now it's an integer without decimals

    // Call the smart contract to record the investment (amount in TND)
    const tx = await contract.recordInvestment(projectId, userAddress, amountInCents);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Return the transaction hash (txHash) as confirmation
    return receipt.transactionHash;
  } catch (error) {
    console.error("Error recording investment on blockchain:", error);
    throw new Error("Blockchain transaction failed");
  }
};
