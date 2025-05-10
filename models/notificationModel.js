const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Reference to User (optional)
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false }, // Reference to Admin (optional)
    message: String, // Notification message
    type: String, // Type of notification (e.g., Order Update, Payment Alert)
    isRead: { type: Boolean, default: false }, // Read status
    createdAt: { type: Date, default: Date.now } // Timestamp
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
