const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');

module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
  };
};