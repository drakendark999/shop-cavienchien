var express = require("express");
var router = express.Router();
var db = require("../models/connect");

var data = require("../models/data");

/* GET shop page. */
data.getData("category", function (categoryData) {
    let showProduct = 6;
    router.get("/:id", function (req, res) {
        let id = req.params.id;
        let sql = `SELECT * from product WHERE category_id = ${id}`;
        db.query(sql, function (err, productData) {
            res.render("pages/shop", { category: categoryData, products: productData, username: req.session.username });
        });
    });

    data.getData("product", function (productData) {
        router.get("/", function (req, res) {
            res.render("pages/shop", { category: categoryData, products: productData, username: req.session.username });
        });
    });
});

module.exports = router;
