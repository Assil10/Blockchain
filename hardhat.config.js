require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20", 
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      timeout: 60000,
    },
  },
};

/*
InvestmentManager deployed at: 0xC25E147316c1dBD16f5B6427e381f9F4fF9510D6
ProjectRegistry deployed at:  0xed3c0f14c4b767A65955B71dD1f8328f51f38DE0
RentDistributor deployed at: 0x74Ca4D7B2856dddCb1a074A9e40A7fC33deD6437
*/ 
