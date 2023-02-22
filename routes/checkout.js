var express = require("express");
var router = express.Router();

var db = require("../models/connect");
var data = require("../models/data");
var apiData = require("../models/apiProduct");

/* GET product detail page. */

data.getData("category", function (categoryData) {
    router.get("/", function (req, res) {
        res.render("pages/checkout", { category: categoryData, username: req.session.username });
    });
});

router.post("/api/orders", function (req, res, next) {
    let data = req.body;
    apiData.add("orders", data, function () {
        res.json({ thongbao: "đã thêm user mới" });
    });
});

router.get("/api/ordersmax", (req, res) => {
    apiData.max("orders", (item) => {
        res.json(item);
    });
});

router.post("/api/order-detail", function (req, res, next) {
    let data = req.body;
    apiData.add("order_detail", data, function () {
        res.json({ thongbao: "Đã thêm 1 user mới" });
    });
});

module.exports = router;
