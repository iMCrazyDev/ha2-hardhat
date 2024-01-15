// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MMDLSGradingContract {
    address public professor;
    mapping(address => uint[8]) public grades;
    mapping(address => uint) public finalGrades;

    modifier onlyProfessor() {
        require(msg.sender == professor, "Only the professor can call this function");
        _;
    }

    constructor() {
        professor = msg.sender;
    }

    function assignGrades(address studentId, uint[8] memory studentGrades) external onlyProfessor {
        require(studentGrades.length == 8, "Invalid number of grades");

        grades[studentId] = studentGrades;
    }

    function computeFinalGrade(address studentId) external onlyProfessor {
        uint[8] memory studentGrades = grades[studentId];
        uint numerator = (max(studentGrades[0] + studentGrades[1], 2 * studentGrades[6]) +
            studentGrades[2] + studentGrades[3] + studentGrades[4] + studentGrades[5]);
        uint intermediate = min(
            numerator / 6 + (numerator % 6 >= 3 ? 1 : 0),
            10
        );

        if (studentGrades[7] > 0) {
            uint val = (4 * intermediate + 6 * studentGrades[7]);
            finalGrades[studentId] = min(val / 10 + (val % 10 >= 5 ? 1 : 0), 10);
        } else {
            finalGrades[studentId] = intermediate * (intermediate >= 6 ? 1 : 0);
        }
    }

    function max(uint a, uint b) internal pure returns (uint) {
        return a > b ? a : b;
    }

    function min(uint a, uint b) internal pure returns (uint) {
        return a < b ? a : b;
    }
}
