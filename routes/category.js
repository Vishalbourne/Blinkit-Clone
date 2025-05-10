const express = require('express');
const router = express.Router();
const { Category, validateCategory } = require('../models/categoryModel');
const validateAdmin = require('../middleware/adminMiddleware');

router.post('/create', validateAdmin, async function (req, res) {
    if (req.user.role === 'admin') {
        try {
            const cate = req.body.name.trim(); // Remove extra spaces

            // Check if category already exists
            const existingCategory = await Category.findOne({ name: cate });

            if (existingCategory) {
                return res.status(400).send("Category already exists!");
            }

            // Create new category if not found
            await Category.create({ name: cate });

            res.redirect("back");
        } catch (error) {
            console.error("❌ Error creating category:", error.message);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(403).send("Unauthorized to perform this action");
    }
});

module.exports = router;
