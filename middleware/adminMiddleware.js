const jwt = require('jsonwebtoken');

require('dotenv').config

function validateAdmin(req, res, next) {
    try {
        // 🔹 Get token from cookies
        const token = req.cookies.token;

        // 🔹 Check if token exists
        if (!token) {
            return res.status(401).json({ message: "Access Denied! No token provided." });
        }

        // 🔹 Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // 🔹 Check if user is an admin
        if (verified.role !== 'admin') {
            return res.status(403).json({ message: "Access Forbidden! Admins only." });
        }

        // 🔹 Store user data in `req.user` for later use
        req.user = verified;

        // 🔹 Continue to the next middleware/route
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid Token!" });
    }
}

module.exports = validateAdmin;
