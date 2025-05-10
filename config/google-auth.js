const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/userModel'); // Import User model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,  // From Google Cloud Console
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // From Google Cloud Console
    callbackURL: "http://localhost:5000/auth/google/callback", // Redirect URL after Google login
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value
            });
            await user.save();
        }
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
