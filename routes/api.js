var express = require("express");
var router = express.Router();

var db = require("../models/connect");
var modelProducts = require("../models/apiProduct");

router.get("/products", function (req, res) {
    modelProducts.list((listProduct) => {
        res.json(listProduct);
    });
});

router.get('/products/detail/:id', function (req, res) {
  let id = req.params.id;
  modelProducts.read(id,detailProduct=>{
    res.json(detailProduct);
  })
})

router.get('/products/date',function (req, res) {
  modelProducts.date(listProduct=>{
    res.json(listProduct);
  })
})

router.get('/products/views',function (req, res) {
  modelProducts.views(listProduct=>{
    res.json(listProduct);
  })

})



router.get('/products/hot', function (req, res){
  modelProducts.hot(listProduct=>{
    res.json(listProduct);
  })
})

router.get('/category/products/:id', function (req, res){
  let id = req.params.id
  modelProducts.baseOnCat(id,listProduct=>{
    res.json(listProduct);
  })
})

module.exports = router;
