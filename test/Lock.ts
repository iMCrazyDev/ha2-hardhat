const { expect, assert } = require('chai');
const { ethers } = require('hardhat');

describe('MMDLSGradingContract', function () {
    let gradingContract;
    let proffesor;
    let student;

    before(async function () {
        [proffesor, student] = await ethers.getSigners();
    
        const GradingContract = await ethers.getContractFactory('MMDLSGradingContract');
        gradingContract = await GradingContract.deploy();
    });

    it('correct assignments and calculations', async function () {
        const studentId = student.address;
        const studentGrades = [10, 8, 7, 2, 4, 7, 3, 5];

        await gradingContract.assignGrades(studentId, studentGrades);
        await gradingContract.computeFinalGrade(studentId);

        const finalGrade = await gradingContract.finalGrades(studentId);
        expect(finalGrade).to.equal(5); 
    });

    it('0 for exam and Intermediate is final', async function () {
      const studentId = student.address;
      const studentGrades = [10, 8, 7, 2, 4, 7, 3, 0];

      await gradingContract.assignGrades(studentId, studentGrades);
      await gradingContract.computeFinalGrade(studentId);

      const finalGrade = await gradingContract.finalGrades(studentId);
      expect(finalGrade).to.equal(6); 
  });

  it('0 for exam and Intermediate=0', async function () {
    const studentId = student.address;
    const studentGrades = [0, 8, 7, 2, 4, 7, 3, 0];

    await gradingContract.assignGrades(studentId, studentGrades);
    await gradingContract.computeFinalGrade(studentId);

    const finalGrade = await gradingContract.finalGrades(studentId);
    expect(finalGrade).to.equal(0); 
  });

  it('not enough grades', async function () {
    const studentId = student.address;
    const studentGrades = [0, 8, 7, 2, 4, 7, 3];
    try {
      await gradingContract.assignGrades(studentId, studentGrades);
      assert.fail("Expected an error but none was thrown");
    } catch (error) { }
  });

  it('only exam for 4', async function () {
    const studentId = student.address;
    const studentGrades = [0, 0, 0, 0, 0, 0, 0, 6];

    await gradingContract.assignGrades(studentId, studentGrades);
    await gradingContract.computeFinalGrade(studentId);

    const finalGrade = await gradingContract.finalGrades(studentId);
    expect(finalGrade).to.equal(4); 
  });
});
