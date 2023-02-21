var express = require("express");
var router = express.Router();
var db = require("../../models/connect");

var data = require("../../models/data");

data.getHotData("product", function (listHotProducts) {
    data.getViewData("product", function (listViewProducts) {
        data.getData("category", function (category) {
            router.get("/", function (req, res) {
                if (req.session.admin) {
                    res.render("admin/home", {
                        categories: category,
                        products: listHotProducts,
                        productsView: listViewProducts,
                    });
                } else {
                    res.redirect("/admin/login");
                }
            });
        });
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

data.getData('category',(category) => {
    
    router.get('/add-product',(req,res) => {
        res.render('admin/pages/formProduct',{category: category})
    })
})

module.exports = router;
