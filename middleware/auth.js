const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// Extracts JWT Token from JSON headers and authenticates the User.
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(400).json({
            message: 'Auth Failed'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const tk = process.env.TOKEN_SECRET;

        const userId = jwt.verify(token, tk);

        let user = await User.findByPk(userId.userId);
        
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Session Timed Out Please Signin Again'
            });
        } else {
            console.log(error);
            return res.status(500).json({
                message: 'Something Went Wrong - Please Signin Again'
            });
        }
    }
};

module.exports = {
    authenticate
};