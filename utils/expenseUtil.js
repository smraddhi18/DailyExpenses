// utils/expenseUtils.js
function calculateEqualSplit(totalAmount, users) {
    const perPerson = totalAmount / users.length;
    return users.map(user => ({
      userId: user._id,
      amountOwed: perPerson
    }));
  }
  
  function calculateExactSplit(amounts, users) {
    return users.map((user, idx) => ({
      userId: user._id,
      amountOwed: amounts[idx]
    }));
  }
  
  function calculatePercentageSplit(totalAmount, percentages, users) {
    return users.map((user, idx) => ({
      userId: user._id,
      amountOwed: (totalAmount * percentages[idx]) / 100
    }));
  }
  
  module.exports = { calculateEqualSplit, calculateExactSplit, calculatePercentageSplit };
  