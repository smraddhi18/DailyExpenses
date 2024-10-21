// utils/balanceSheet.js

const Expense = require('../models/Expense');
const User = require('../models/User');

exports.generateBalanceSheet = async (userId) => {
  const expenses = await Expense.find({ 
    $or: [
      { createdBy: userId },
      { 'participants.user': userId }
    ]
  }).populate('paidBy', 'name').populate('participants.user', 'name');

  const balances = {};

  expenses.forEach(expense => {
    const paidBy = expense.paidBy._id.toString();
    
    expense.participants.forEach(participant => {
      const participantId = participant.user._id.toString();
      
      if (!balances[participantId]) balances[participantId] = {};
      if (!balances[paidBy]) balances[paidBy] = {};

      let amount;
      switch (expense.splitMethod) {
        case 'EQUAL':
          amount = expense.amount / expense.participants.length;
          break;
        case 'EXACT':
          amount = participant.amount;
          break;
        case 'PERCENTAGE':
          amount = (expense.amount * participant.percentage) / 100;
          break;
      }

      if (participantId !== paidBy) {
        balances[participantId][paidBy] = (balances[participantId][paidBy] || 0) + amount;
        balances[paidBy][participantId] = (balances[paidBy][participantId] || 0) - amount;
      }
    });
  });

  // Simplify balances
  const simplifiedBalances = [];
  Object.keys(balances).forEach(fromUserId => {
    Object.keys(balances[fromUserId]).forEach(toUserId => {
      if (balances[fromUserId][toUserId] > 0) {
        simplifiedBalances.push({
          from: fromUserId,
          to: toUserId,
          amount: balances[fromUserId][toUserId]
        });
      }
    });
  });

  return simplifiedBalances;
};

exports.generateBalanceSheetCSV = async (userId) => {
  const balances = await this.generateBalanceSheet(userId);
  const users = await User.find({ _id: { $in: balances.map(b => [b.from, b.to]).flat() } });
  const userMap = users.reduce((acc, user) => {
    acc[user._id.toString()] = user.name;
    return acc;
  }, {});

  let csv = 'From,To,Amount\n';
  balances.forEach(balance => {
    csv += `${userMap[balance.from]},${userMap[balance.to]},${balance.amount.toFixed(2)}\n`;
  });

  return csv;
};