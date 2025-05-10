const express = require('express');
const router = express.Router();
const { User , validateUser } = require('../models/userModel');
// const validateAdmin = require('../middleware/adminMiddleware');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/login', async function (req, res) {
    res.render('user_login');
});

router.get('/logout',isLoggedIn,function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }

        // Destroy session before redirecting
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // Remove session cookie
            res.redirect('/users/login'); // Now safe to redirect
        });
    });
});



module.exports = router;
