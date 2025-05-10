const express = require('express');
const router = express.Router();
const { Product, validateProduct } = require('../models/productModel');
const { Category, validateCategory } = require('../models/categoryModel');
const {Cart} = require('../models/cartModel');
const upload = require('../config/multer-config');
const validateAdmin =  require('../middleware/adminMiddleware')
const isLoggedIn =  require('../middleware/isLoggedIn')

router.get('/',isLoggedIn, async function (req, res) {
    try {

        let somethingInCart = false;

        let cart = await Cart.findOne({user: req.session.passport.user});

        if(cart && cart.products.length > 0) {
            somethingInCart = true;
        }


        const prod = await Product.aggregate([
            {
                $sample:{
                    size: 3
                }
            }
        ]);

        
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
  
        res.render("index",{rnproducts:prod,products:formattedResults,somethingInCart,cartCount:cart ? cart.products.length : 0});
    } catch (error) {
        console.error("❌ Error fetching products:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/', upload.single('image'), async function (req, res) {
    try {
        // Extract and validate product data
        let { name, price, category, description, stock, image } = req.body;
        let { error } = validateProduct({ name, price, category, description, stock, image });

        if (error) return res.status(400).send(error.details[0].message);

        // Check if category exists, if not, create it
        const categoryExists = await Category.findOne({ name: category });
        if (!categoryExists) {
            await Category.create({ name: category });
        }

        // Handle image upload (check if req.file exists)
        let imageBuffer;
        if (req.file) {
            imageBuffer = req.file.buffer; // ✅ Use uploaded image
        } else {
            imageBuffer = null; // ❌ No image uploaded, so set to null
        }

        // Create and save the new product
        let product = new Product({ name, price, category, description, stock, image: imageBuffer });
        await product.save();

        // Redirect to admin dashboard
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.error("❌ Error adding product:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/delete/:id',validateAdmin,async function(req, res){

    if(req.user.role === 'admin'){

    try {
        // Find and delete product by id
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send("Product not found");
        res.redirect("back");
    }catch (err) {
        console.error("�� Error deleting product:", err.message);
        res.status(500).send("Internal Server Error");
    }
}else{
    res.status(403).send("Unauthorized to perform this action");
}

})

router.post("/delete",validateAdmin,async function(req,res){

    if(req.user.role == "admin"){
        try{
            // Extract product ids from request body
            const { ids } = req.body;
            // Find and delete products by ids
            await Product.findOneAndDelete({ids})
            res.redirect("/admin/products");
        }catch(err){
            console.error("�� Error extracting product ids:", err.message);
            res.status(500).send("Internal Server Error");
        }
    }else{
        res.status(403).send("Unauthorized to perform this action");
    }

})
module.exports = router;
