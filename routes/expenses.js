// Update routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controller/expenseController');

router.post('/addExpense',  expenseController.addExpense);
router.get('/user/:userId',  expenseController.getUserExpenses);
router.get('/',  expenseController.getAllExpenses);
router.get('/balance-sheet',  expenseController.getBalanceSheet);
router.get('/balance-sheet/download',  expenseController.downloadBalanceSheet);

module.exports = router;