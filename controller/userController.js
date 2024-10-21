const { StatusCodes } = require('http-status-codes')
const userService = require('../services/userService')
const User = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { userId: user.id }, token })
}

const getUserDetails = async(req,res) =>{
    try {
        const user = await userService.getUserById(req.params.id)
        res.status(StatusCodes.OK).json(user)
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({msg:error.message})
    }
}

module.exports = {register,login,getUserDetails}