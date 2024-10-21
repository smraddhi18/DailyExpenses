const express = require('express')
const router = express.Router()
const userController = require('../controller/userController');
const auth = require('../middleware/authentication');

router.post('/register',  userController.register);
router.post('/login', userController.login);
router.get('/:id', auth, userController.getUserDetails);

module.exports = router;