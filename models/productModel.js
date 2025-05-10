const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    image: { type: Buffer }
});

const Product = mongoose.model('Product', productSchema);

// Joi Validation Function
const validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().trim().required(),
        stock: Joi.number().min(0).required(),
        description: Joi.string().trim().required(),
        image: Joi.string().optional(),
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports = { Product, validateProduct };
