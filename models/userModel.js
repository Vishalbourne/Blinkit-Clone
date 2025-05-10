const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema with Validations
const AddressSchema = new mongoose.Schema({
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    zip: { type: Number, required: true },
    address: { type: String, required: true, trim: true }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { 
        type: String,  
        minlength: 6 
    },
    phone: { 
        type: String, 
        trim: true, 
        match: /^[0-9]{10}$/ 
    },
    addresses: { type: [AddressSchema], default: [] },
    // cart :[{type :mongoose.Schema.Types.ObjectId,ref: 'cart'}],
    googleId: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Joi Validation Function (Placed at Bottom)
const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(50).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(6).required().messages({
            "string.min": "Password must be at least 6 characters long"
        }),
        phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
            "string.pattern.base": "Phone number must be exactly 10 digits"
        }),
        addresses: Joi.array().items(
            Joi.object({
                state: Joi.string().trim().required(),
                city: Joi.string().trim().required(),
                zip: Joi.number().required(),
                address: Joi.string().trim().required()
            })
        ).optional(),
        googleId: Joi.string().optional(),
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports = { User, validateUser };
