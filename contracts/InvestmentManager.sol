// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract InvestmentManager {
    address public admin;

    struct Investment {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => mapping(address => Investment)) public investments;

    event InvestmentRecorded(uint256 indexed projectId, address indexed investor, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function recordInvestment(uint256 projectId, address investor, uint256 amount) external onlyAdmin {
        investments[projectId][investor] = Investment(amount, block.timestamp);
        emit InvestmentRecorded(projectId, investor, amount);
    }

    function getInvestment(uint256 projectId, address investor) external view returns (uint256 amount, uint256 timestamp) {
        Investment memory inv = investments[projectId][investor];
        return (inv.amount, inv.timestamp);
    }
}
