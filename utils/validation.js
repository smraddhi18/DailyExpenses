// Update utils/validation.js
const Joi = require('joi');

exports.expenseSchema = Joi.object({
  description: Joi.string().required(),
  amount: Joi.number().positive().required(),
  paidBy: Joi.string().required(),
  splitMethod: Joi.string().valid('EQUAL', 'EXACT', 'PERCENTAGE').required(),
  participants: Joi.array().items(
    Joi.object({
      user: Joi.string().required(),
      amount: Joi.when('..splitMethod', {
        is: 'EXACT',
        then: Joi.number().required(),
        otherwise: Joi.forbidden()
      }),
      percentage: Joi.when('..splitMethod', {
        is: 'PERCENTAGE',
        then: Joi.number().min(0).max(100).required(),
        otherwise: Joi.forbidden()
      })
    })
  ).required().min(1)
}).custom((value, helpers) => {
  if (value.splitMethod === 'PERCENTAGE') {
    const totalPercentage = value.participants.reduce((sum, p) => sum + (p.percentage || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      return helpers.message('The sum of percentages must be 100%');
    }
  } else if (value.splitMethod === 'EXACT') {
    const totalAmount = value.participants.reduce((sum, p) => sum + (p.amount || 0), 0);
    if (Math.abs(totalAmount - value.amount) > 0.01) {
      return helpers.message('The sum of individual amounts must equal the total expense amount');
    }
  }
  return value;
});

exports.validateExpense = (expenseData) => {
  const { error } = exports.expenseSchema.validate(expenseData, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map(detail => detail.message).join(', '));
  }
};