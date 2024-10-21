// controllers/expenseController.js

const { StatusCodes } = require('http-status-codes');
const expenseService = require('../services/expenseService');
const balanceSheet = require('../utils/balanceSheet');
const { validateExpense } = require('../utils/validation');

const addExpense = async (req, res) => {
  try {
    validateExpense(req.body);
   await expenseService.addExpense(req.body)
    res.status(StatusCodes.CREATED).json({msg:"Expense added"});
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getUserExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getUserExpenses(req.user.userId);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBalanceSheet = async (req, res) => {
  try {
    const balances = await balanceSheet.generateBalanceSheet(req.user.userId);
    res.json(balances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadBalanceSheet = async (req, res) => {
  try {
    const csv = await balanceSheet.generateBalanceSheetCSV(req.user.userId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=balance_sheet.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addExpense,
  getUserExpenses,
  getAllExpenses,
  getBalanceSheet,
  downloadBalanceSheet,
};
