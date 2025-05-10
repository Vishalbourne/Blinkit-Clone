const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validateAdmin = require('../middleware/adminMiddleware');
const {Admin} = require('../models/adminModel');
const {Product} = require('../models/productModel');
const {Category} = require('../models/categoryModel');

require("dotenv").config


if(process.env.NODE_ENV === 'development'){

    console.log('Running in development mode')
    router.get('/create',async function(req, res){

        try {
            // Generate salt for password hashing
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash('12345', salt);
    
            // Create new admin user
            const user = new Admin({
                name: 'admin',
                password: hash,
                role: 'admin',
                email: 'admin@admin.com'
            });
    
            // Save the admin user
            await user.save();
    
            // Generate JWT token
            const token = jwt.sign({ email: 'admin@admin.com' }, process.env.JWT_SECRET_KEY);
    
            res.send("Admin created successfully! Token: " + token);
        } catch (error) {
            console.error("❌ Error creating admin:", error.message);
            res.status(500).send("Internal Server Error");
        }
    });
    }

router.get('/login',function(req, res){
    res.render('admin_login');
})

router.post('/login', async (req, res) => {
    try {
        // 🔹 Extract email and password from request body
        const { email, password } = req.body;

        // 🔹 Find admin by email
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password'); // ❌ User not found
        }

        // 🔹 Compare the provided password with the hashed password in the database
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid email or password'); // ❌ Password does not match
        }

        // 🔹 Generate a JWT token for authentication
        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET_KEY);

        // 🔹 Set the token as a cookie
        res.cookie('token', token, { httpOnly: true, secure: true });

        // 🔹 Redirect to admin dashboard after successful login
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("❌ Error during login:", error.message);
        res.status(500).send("Internal Server Error"); // ❌ Catch unexpected errors
    }
});

router.get('/dashboard',validateAdmin, async (req, res) => {
    try {
        // Fetch total product count from MongoDB
        const prodcount = await Product.countDocuments();
        const categcount = await Category.countDocuments();

        res.render('admin_dashboard', { prodcount,categcount });

        // if(process.env.NODE_ENV === 'development')console.log(req.user)
  
    } catch (error) {
        console.error("❌ Error fetching product count:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/products',validateAdmin, async (req, res) => {
        const results = await Product.aggregate([
          {
            $group: {
              _id: "$category", // Group products by category name
              products: { $push: "$$ROOT" } // Push all products into an array
            }
          },
          {
            $addFields: {
              products: { $slice: ["$products", 10] } // Limit to first 10 products
            }
          },
          {
            $project: {
              _id: 0, // Remove the _id field
              category: "$_id",
              products: 1
            }
          }
        ]);

        const formattedResults = results.reduce((acc, item) => {
            acc[item.category] = item.products;
            return acc;
          }, {});

    res.render('admin_products', { products:formattedResults });
})

router.get('/products/search', async (req, res) => {
    const { product_id } = req.query;

    try {
        const product = await Product.findById(product_id);

        if (!product) {
            return res.render('admin_products', {
                error: 'Product not found',
                products: []
            });
        }

        res.render('admin_products', {
            products: { [product.category]: [product] },
            success: 'Product found'
        });
    } catch (err) {
        console.error(err);
        res.render('admin_products', {
            error: 'Invalid Product ID',
            products: []
        });
    }
});


router.get('/logout', validateAdmin, async (req, res) => {

    res.cookie("token","");
    res.redirect('/admin/login');
})

module.exports = router;