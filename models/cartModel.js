const mongoose = require('mongoose');
const Joi = require('joi');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },],
    totalPrice: { type: Number, required: true, min: 0 }
});

const Cart = mongoose.model('Cart', cartSchema);

// Joi Validation Function
const validateCart = (data) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        products: Joi.array().items(Joi.string().required()).required(),
        totalPrice: Joi.number().min(0).required(),
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports = { Cart, validateCart };
