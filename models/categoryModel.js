const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema for Category
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 }
});

const Category = mongoose.model('Category', categorySchema);

// Joi Validation Function for Category
const validateCategory = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(50).required()
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports = { Category, validateCategory };
