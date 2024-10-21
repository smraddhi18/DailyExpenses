
const Expense = require("../models/Expense");

const addExpense = async ({ amount, splitMethod, participants, amounts, percentages, description }) => {
  let splitDetails;
  if (splitMethod === 'Equal') {
    splitDetails = calculateEqualSplit(amount, participants);
  } else if (splitMethod === 'Exact') {
    splitDetails = calculateExactSplit(amounts, participants);
  } else if (splitMethod === 'Percentage') {
    if (percentages.reduce((a, b) => a + b, 0) !== 100) {
      return res.status(400).json({ error: "Percentages must add up to 100%" });
    }
    splitDetails = calculatePercentageSplit(amount, percentages, participants);
  }

  const newExpense = new Expense({
    amount,
    splitMethod,
    participants: splitDetails,
    description
  });

  await newExpense.save();
};

const getUserExpenses = async (userId) => {
  const expenses = await Expense.find({
    $or: [
      { createdBy: userId }, // Expenses created by the user
      { "participants.user": userId } // Expenses where the user is a participant
    ]
  })
  .select('description amount date splitMethod paidBy participants') // Select fields including amount
  .populate('paidBy', 'name email') // Populate the paidBy field with name and email
  .populate('participants.user', 'name email') // Populate participants' user field with name and email
  .lean(); // Returns a plain JavaScript object for easier manipulation

  // Calculate how much each user needs to pay or be paid
  const userExpenses = expenses.map(expense => {
    const paidByUser = expense.paidBy._id.toString();
    const totalAmount = expense.amount;

    // Find the current user's participation
    const userParticipant = expense.participants.find(participant => participant.user._id.toString() === userId);

    if (!userParticipant) return expense; // No participant found for this user, return as is

    const userOwes = userParticipant.amount || (totalAmount / expense.participants.length); // If EQUAL split, calculate accordingly
    const amountToPay = userId === paidByUser ? 0 : userOwes; // Paid by user owes nothing

    return {
      ...expense,
      amountToPay, // How much the user needs to pay
      payTo: expense.paidBy, // User needs to pay the person who paid
    };
  });

  return userExpenses;
};


const getAllExpenses = async () => {
  return await Expense.find().populate('createdBy', 'name email').populate('paidBy', 'name email');
};

module.exports = { addExpense, getUserExpenses, getAllExpenses };
