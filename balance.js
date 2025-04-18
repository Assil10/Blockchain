const hre = require("hardhat");

async function main() {
    const provider = hre.ethers.provider;
    const walletAddress = "0x62ef1b3BD681ec3716dD58A5bB6f6cC16bBFD743"; 
    const balance = await provider.getBalance(walletAddress);
    console.log("Wallet Balance:", hre.ethers.utils.formatEther(balance), "ETH");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});