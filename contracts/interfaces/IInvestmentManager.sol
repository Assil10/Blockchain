// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IInvestmentManager {
    function getInvestment(uint256 projectId, address investor) external view returns (uint256, uint256);
}
