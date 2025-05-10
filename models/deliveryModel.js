const mongoose = require('mongoose');
const Joi = require('joi');

const deliverySchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    deliveryBoy: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    trackingUrl: { type: String, required: true },
    estimatedTime: { type: Date, required: true }
});

const Delivery = mongoose.model('Delivery', deliverySchema);

// Joi Validation Function
const validateDelivery = (data) => {
    const schema = Joi.object({
        order: Joi.string().required(),
        deliveryBoy: Joi.string().required(),
        status: Joi.string().valid('Pending', 'Shipped', 'Out for Delivery', 'Delivered').optional(),
        trackingUrl: Joi.string().uri().required(),
        estimatedTime: Joi.date().required(),
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports = { Delivery, validateDelivery };
