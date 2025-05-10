const express = require('express');
const router = express.Router();

router.get('/',function(req, res){
    res.redirect("/products");
})

router.get("/map/:orderid",function(req, res){
    res.render("map", {orderId: req.params.orderid});
});

module.exports = router;