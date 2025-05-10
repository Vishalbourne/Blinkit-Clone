const express = require('express');
const router = express.Router();
const passport = require('passport');

// require('../config/google-auth'); // Ensure Passport is configured

// Google OAuth Login Route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback Route
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }), 
    (req, res) => {
        res.redirect('/products');
    }
);

// Logout Route
router.post('/logout', async (req, res, next) => {
    try {
        await req.logout();
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
