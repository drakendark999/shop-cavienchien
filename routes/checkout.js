var express = require("express");
var router = express.Router();

var db = require("../models/connect");
var data = require("../models/data");

/* GET product detail page. */

data.getData("category", function (categoryData) {
    router.get("/", function (req, res) {
        res.render("pages/checkout", { category: categoryData, username: req.session.username });
    });
});


router.get("/api", function (req, res, next) {
    data.getData('orders',function (listUsers) {
        res.json(listUsers);
    });
});

router.get("/api/order-detail", function (req, res, next) {
    data.getData('order_detail',function (listUsers) {
        res.json(listUsers);
    });
});

module.exports = router;
