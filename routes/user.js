const path = require('path');
const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

// User Signup
router.post('/signup', userController.postUser);

// User Login
router.post('/login', userController.postLogin);

module.exports = router;