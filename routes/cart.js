const express = require('express');
const router = express.Router();
const { Cart, validateCart } = require('../models/cartModel');
const { Product} = require('../models/productModel');

const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/',isLoggedIn, async function (req, res) {
    try {
        const cart = await Cart.findOne({user : req.session.passport.user}).populate('products')
        if(!cart || cart.products.length === 0) return res.redirect("/products");

        let cartStructure = cart.products.reduce((acc, product) => {
            let key = product._id.toString();
            if (acc[key]) {
                acc[key].quantity += 1; // Increase quantity if product exists
            } else {
                acc[key] = { ...product._doc, quantity: 1 }; // Add product with quantity 1
            }
            return acc;
        }, {});


        
        let finalArray = Object.values(cartStructure);

        let finalprice = cart.totalPrice + 34
        
        res.render("cart",{cart:finalArray,finalprice,userid:req.session.passport.user});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/add/:id', isLoggedIn, async function (req, res){
    try {
        let cart = await Cart.findOne({user : req.session.passport.user})
        let product = await Product.findById(req.params.id);
        if(!product) return res.status(404).send('Product not found');
        if(!cart) {
            cart = new Cart({user : req.session.passport.user});
            cart.products.push(product);
            cart.totalPrice = Number(product.price)
            await cart.save();
        }else{
            cart.products.push(product);
            cart.totalPrice = Number(product.price) + Number(cart.totalPrice)
            await cart.save();
        }
        res.redirect('back');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

router.get('/remove/:id',isLoggedIn,async function(req,res){
    try {
        const cart = await Cart.findOne({user : req.session.passport.user});
        const product = await Product.findById(req.params.id);
        if(!cart) return res.status(404).send('Cart not found');
        let idx = cart.products.indexOf(req.params.id)

        if(idx !== -1){
            cart.products.splice(idx,1);
        cart.totalPrice = Number(cart.totalPrice) - Number(product.price)
        }
        else return res.status(404).send('Cart not found');

        await cart.save();
        res.redirect("back");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;
