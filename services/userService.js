const User = require('../models/User')

exports.getUserById = async(userId)=>{
    return await User.findById(userId)
}