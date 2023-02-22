var express = require("express");
var router = express.Router();
var db = require("../../models/connect");
var path = require('path')

var data = require("../../models/data");
const formidable = require("formidable");
const fs = require("fs");

data.getData("orders", function (listOrder) {
    data.getViewData("product", function (listViewProducts) {
        data.getData("category", function (category) {
            router.get("/", function (req, res) {
                if (req.session.admin) {
                    console.log(listOrder);
                    res.render("admin/home", {
                        categories: category,
                        listOrder: listOrder,
                        productsView: listViewProducts,
                    });
                } else {
                    res.redirect("/admin/login");
                }
            });
        });
    });
});

data.getData("category", function (category) {
    router.get("/orders=:id", (req, res) => {
        let id = req.params.id;
        let sql = `SELECT * FROM order_detail WHERE order_id =${id}`;
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            } else {
                sql = `SELECT * FROM order_detail INNER JOIN product ON order_detail.product_id = product.id`;
                db.query(sql, (err, data) => {
                    if (err) throw err;
                    res.render("admin/pages/detailOrder", { data: data, categories: category });
                });
            }
        });
    });
});

router.get("/update-orders=:id", (req, res) => {
    let id = req.params.id;
    let sql = `UPDATE orders SET status='Xác nhận' WHERE id =${id}`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        res.redirect("/admin");
    });
});

router.get("/login", function (req, res) {
    let adminError = false;
    if (req.session.adminError) {
        adminError = true;
    }
    res.render("admin/login", { adminError: adminError });
});

router.post("/login_", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    let sql = "SELECT * FROM users WHERE username=? AND vaitro = 1";
    db.query(sql, [username], function (err, rows) {
        if (rows.length <= 0) {
            let sess = req.session;
            sess.adminError = true;
            res.redirect("/admin/login");
        } else {
            let user = rows[0];
            let pass_fromdb = user.matkhau;
            const bcrypt = require("bcrypt");
            var kq = bcrypt.compareSync(password, pass_fromdb);
            if (kq) {
                console.log("OK");
                let sess = req.session;
                sess.logined = true;
                sess.admin = username;
                console.log(sess.username);
                res.redirect("/admin");
            } else {
                let sess = req.session;
                sess.adminError = true;
                res.redirect("/admin/login");
            }
        }
    });
});

router.get("/send", function (req, res) {
    if (req.session.admin) {
        res.render("admin/pages/send", {
            errorEmail: req.session.errorEmail,
            successEmail: req.session.successEmail,
        });
    } else {
        res.redirect("/admin/login");
    }
});
router.post("/send_", function (req, res) {
    let title = req.body.title;
    let email = req.body.email;
    let content = req.body.content;
    let sql = `SELECT * FROM users WHERE email = ?`;

    db.query(sql, [email], function (err, rows) {
        if (err) throw err;
        if (rows.length <= 0) {
            let sess = req.session;
            sess.errorEmail = email;
            res.redirect("/admin/send");
        } else {
            var nodemailer = require("nodemailer");
            var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: "phuckmps19413@fpt.edu.vn", pass: "farajina123" },
                tls: { rejectUnauthorized: false },
            });

            var mailOptions = {
                from: "phuckmps19413@fpt.edu.vn",
                to: email,
                subject: title,

                html: content, //NộiDungThư, có thể có code html,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) console.log(error);
                else console.log("Đã gửi mail: " + info.response);
                let sess = req.session;
                sess.successEmail = email;
                res.redirect("/admin/send");
            });
        }
    });
});
data.getData("product", function (products) {
    data.getData("category", function (category) {
        router.get("/products", function (req, res) {
            res.render("admin/pages/products", {
                categories: category,
                products: products,
            });
        });
    });
});

data.getData("category", (category) => {
    router.get("/add-product", (req, res) => {
        res.render("admin/pages/formProduct", { category: category });
    });
});
router.post("/add-product", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let pathFile = files.hinhsp.filepath;
        let tenFile = files.hinhsp.originalFilename;

        let nameProduct = fields.tenSp;
        let price = fields.gia;
        
        let category_id = fields.theLoai;
        let describe = fields.moTa;

        let desPath = path.join(__dirname, "..", "..", "public/img/" + tenFile);
        console.log("day là despath: " + desPath);
        fs.copyFile(pathFile, desPath, function (err) {
            if (err) throw err;
            fs.unlink(pathFile, function () {
                console.log("Đã xóa file tạm");
            });
            console.log(`Đã upload xong file: ${tenFile} `);
        });
        let newSp = {
            nameProduct: nameProduct,
            price: price,
            
            category_id: category_id,
            describe: describe,
            image: tenFile,
        };
        console.log(newSp);

        let sql = `INSERT INTO product SET ?`;
        db.query(sql, newSp, function (err, dataAdd) {
            if (err) throw err;
            res.redirect("/admin");
        });
    });
});
module.exports = router;
