const mongoose = require('mongoose');
const Joi = require('joi');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    totalPrice: { type: Number, required: true, min: 0 },
    address: {
        state: String,
        city: String,
        zip: String,
        address: String
    },
    status: { type: String, default: 'Pending' },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    delivery: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' }
});

const Order = mongoose.model('Order', orderSchema);

// Joi Validation Function
const validateOrder = (data) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        products: Joi.array().items(Joi.string().required()).required(),
        totalPrice: Joi.number().min(0).required(),
        address: Joi.object({
            state: Joi.string().required(),
            city: Joi.string().required(),
            zip: Joi.number().required(),
            address: Joi.string().required()
        }).required(),
        status: Joi.string().valid('Pending', 'Shipped', 'Delivered').optional(),
        payment: Joi.string().optional(),
        delivery: Joi.string().optional(),
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports = { Order, validateOrder };
