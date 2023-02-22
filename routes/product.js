var express = require("express");
var router = express.Router();

var db = require("../models/connect");
var data = require('../models/data')


/* GET product detail page. */
data.getData("category", function (categoryData) {
    data.getData("product", function (productData) {
        router.get("/:id", function (req, res, next) {
            let id = req.params.id;
            
            data.detail(id,'product',function (detailProduct){
                
                res.render("pages/detail", { data: detailProduct, category: categoryData,products : productData,username: req.session.username });
            })
        });
    });
});


module.exports = router;
