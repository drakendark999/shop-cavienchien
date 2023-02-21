var express = require("express");
var router = express.Router();

var db = require("../models/connect");
var data = require("../models/data");

/* GET product detail page. */

data.getData("category", function (categoryData) {
    router.get("/", function (req, res) {
        res.render("pages/cart", { category: categoryData, username: req.session.username });
    });
});

module.exports = router;
