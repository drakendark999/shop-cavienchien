var express = require("express");
var router = express.Router();
var db = require("../models/connect");

var data = require("../models/data");

/* GET home page. */
data.getData("category", function (categoryData) {
    data.getData("product", function (productData) {
        router.get("/", function (req, res) {
            res.render("index", { category: categoryData, product: productData, username: req.session.username });
        });
    });
});

data.getData("category", function (categoryData) {
    router.post("/", function (req, res) {
        let word = req.body.word;

        let sql = `SELECT * FROM product WHERE nameProduct LIKE '%${word}%'`;
        if (word == "") {
            sql = `SELECT * FROM product `;
        }
        db.query(sql, function (err, productData) {
            if (err) throw err;
            res.render("index", { category: categoryData, product: productData, username: req.session.username });
        });
    });
});

module.exports = router;
