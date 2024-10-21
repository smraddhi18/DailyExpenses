const mongoose = require("mongoose");
  const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    splitMethod: { type: String, enum: ["EQUAL", "EXACT", "PERCENTAGE"], required: true },
    participants: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      amountOwed: { type: Number }
    }],
    description: { type: String },
    date: { type: Date, default: Date.now }
  });
  


module.exports = mongoose.model("Expense", expenseSchema);
