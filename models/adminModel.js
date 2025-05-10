const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema for Admin
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }, // Role-based access
    createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

// Joi Validation Function for Admin
const validateAdmin = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(50).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'superadmin').optional()
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports = { Admin, validateAdmin };
