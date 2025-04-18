// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProjectRegistry {
    address public admin;
    uint256 public projectCount;

    enum Status { Open, Funded, Closed }

    struct Project {
        uint256 id;
        string name;
        uint256 goalAmount;
        uint256 currentAmount;
        Status status;
    }

    mapping(uint256 => Project) public projects;

    event ProjectCreated(uint256 id, string name, uint256 goalAmount);
    event ProjectUpdated(uint256 id, uint256 currentAmount, Status status);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createProject(string calldata name, uint256 goalAmount) external onlyAdmin {
        projectCount++;
        projects[projectCount] = Project(projectCount, name, goalAmount, 0, Status.Open);
        emit ProjectCreated(projectCount, name, goalAmount);
    }

    function updateProject(uint256 projectId, uint256 newAmount, Status newStatus) external onlyAdmin {
        Project storage proj = projects[projectId];
        proj.currentAmount = newAmount;
        proj.status = newStatus;
        emit ProjectUpdated(projectId, newAmount, newStatus);
    }
}
