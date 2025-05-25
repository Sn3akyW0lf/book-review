const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generate a Web Token for User Identity Authentication after Login
function generateAccessToken (id) {
    return jwt.sign({ userId: id }, process.env.TOKEN_SECRET);
}

// Controller for User Signup
exports.postUser = async (req, res, next) => {

    try {
        // console.log(req.body);

        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;

        const saltrounds = 10;

        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err);
            const user = await User.create({
                username: username,
                email: email,
                password_hash: hash,
            });
            console.log(user);
    
            res.json({createdUser: user});

        });
    } catch (err) {
        console.log('Error Occurred in controller/user.js');

        res.status(500).json(err);
    }
};

// Controller for User Login
exports.postLogin = async (req, res, next) => {
    try {
        // console.log('test');
        let email = req.body.email;
        let password = req.body.password;

        const user = await User.findAll({
            where: {
                email: email
            }
        });


        console.log(user[0]);

        if (user.length) {
            bcrypt.compare(password, user[0].password_hash, (err, result) => {
                if (err) {
                    throw new Error('Something Went Wrong in Password Hash in controller/user.js');
                }
                if (result) {
                    console.log('Correct Password');
                    return res.status(200).json({ success: true, message: 'User Logged in Successfully', token: generateAccessToken(user[0].user_id), user_id: user[0].user_id });
                } else {
                    console.log('Wrong Password');
                    return res.status(401).json({ success: false, message: 'Wrong Password' });
                }
            })
        } else {
            res.status(404).json(user);
        }
    } catch (err) {
        console.log(err);
    }
};