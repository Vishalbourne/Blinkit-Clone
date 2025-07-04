require('dotenv').config();
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const {Payment} = require('../models/paymentModel');
const isLoggedIn = require('../middleware/isLoggedIn.js');

require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create/orderId',isLoggedIn, async (req, res) => {
    const options = {
      amount: 5000 * 100, // amount in smallest currency unit
      currency: "INR",
    };
    try {
      const order = await razorpay.orders.create(options);
  
      const newPayment = await Payment.create({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'pending',
      });

      res.send(order);
  
    } catch (error) {
      res.status(500).send('Error creating order');
    }
  });

  
router.post('/api/payment/verify',isLoggedIn, async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET
  
    try {
      const { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils.js')
  
      const result = validatePaymentVerification({ "order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
      if (result) {
        const payment = await Payment.findOne({ orderId: razorpayOrderId,status:"pending" });
        payment.paymentId = razorpayPaymentId;
        payment.signature = signature;
        payment.status = 'completed';
        await payment.save();
        res.json({ status: 'success' });
      } else {
        res.status(400).send('Invalid signature');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Error verifying payment');
    }
  });

  module.exports = router;

