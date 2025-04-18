// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IInvestmentManager.sol";

contract RentDistributor {
    address public admin;
    IInvestmentManager public investmentManager;

    event RentCalculated(address indexed investor, uint256 projectId, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor(address investmentManagerAddress) {
        admin = msg.sender;
        investmentManager = IInvestmentManager(investmentManagerAddress);
    }

    function recordRentDistribution(
        uint256 projectId,
        address[] calldata investors,
        uint256 totalRent
    ) external onlyAdmin {
        uint256 totalInvested;

        // Calculate total investment for this project
        for (uint256 i = 0; i < investors.length; i++) {
            (uint256 amount, ) = investmentManager.getInvestment(projectId, investors[i]);
            totalInvested += amount;
        }

        // Emit share of rent per investor
        for (uint256 i = 0; i < investors.length; i++) {
            (uint256 amount, ) = investmentManager.getInvestment(projectId, investors[i]);
            if (amount > 0 && totalInvested > 0) {
                uint256 share = (totalRent * amount) / totalInvested;
                emit RentCalculated(investors[i], projectId, share);
            }
        }
    }
}
