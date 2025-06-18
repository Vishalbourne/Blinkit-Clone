const express = require('express');
const router = express.Router();
const {Payment} = require('../models/paymentModel');
const {Order} = require('../models/orderModel');
const { Cart } = require('../models/cartModel');
const isLoggedIn = require('../middleware/isLoggedIn');


router.get('/:orderId/:paymentId/:signature',isLoggedIn, async (req, res) => {
    const { orderId, paymentId, signature } = req.params;
    let paymentDetails = await Payment.findOne({orderId});
    if (!paymentDetails) return res.status(404).send('Payment not found');
    if (paymentDetails.paymentId!== paymentId || paymentDetails.signature!== signature) return res.status(401).send('Invalid payment details');

    const userId = req.user.id;

    let cart = await Cart.findOne({user:userId});

    await Order.create({
        orderId,
        user:userId,
        products:cart.products,
        totalPrice: cart.totalPrice,
        status: 'processing',
        paymentId,
    })


    if (paymentDetails.status === 'completed') return res.status(200).redirect(`/map/${orderId}/`);
});

router.get('/address/:orderId',isLoggedIn,async (req, res) => {
    const { orderId } = req.params;
    let order = await Order.findOne({orderId});
    if (!order) return res.status(404).send('Sorry , this order does not exist');
    if(!req.body.address) return res.status(404).send('You must provide an address');
    order.address = req.body.address;
    order.save();

    res.redirect('/');
});
 
module.exports = router;