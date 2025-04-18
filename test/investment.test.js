const { expect } = require("chai");
const { ethers } = require("hardhat");

// Import and use chai-bignumber for BigNumber comparisons
const chai = require("chai");
const chaiBignumber = require("chai-bignumber");
chai.use(chaiBignumber());

describe("Investment", function () {
    let Investment, investment, owner, addr1;

    // Deploy the contract before each test
    beforeEach(async function () {
        Investment = await ethers.getContractFactory("Investment");
        [owner, addr1] = await ethers.getSigners();
        investment = await Investment.deploy();
    });

    it("Should add a transaction", async function () {
        // Add a transaction
        await investment.addTransaction(addr1.address, ethers.utils.parseEther("1.0"));

        // Get the transaction count
        const transactionCount = await investment.getTransactionCount();

        // Log the value and type of transactionCount for debugging
        console.log("Transaction Count:", transactionCount.toString());
        console.log("Type of Transaction Count:", typeof transactionCount);

        // Explicitly convert the expected value to a BigNumber
        const expectedCount = ethers.BigNumber.from(1);

        // Ensure both values are BigNumbers and compare them
        expect(transactionCount.toString()).to.equal(expectedCount.toString()); // Compare as strings
    });
});