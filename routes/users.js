var express = require("express");
var router = express.Router();
var db = require("../models/connect");

/* GET home page. */
router.get("/", function (req, res) {
    res.render("pages/login", {
        errorUsername: req.session.haveAcc,
        errorPass: req.session.errorPass,
        errorEmail: req.session.errorEmail,
        successEmail: req.session.successEmail,
    });
});

router.post("/save", function (req, res) {
    let username = req.body.username;
    let email =req.body.email;
    let password = req.body.password;
    let repassword = req.body.password2;

    let sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], function (err, rows) {
        console.log(rows);
        if (rows.length > 0) {
            var sess = req.session;
            sess.haveAcc = username;
            res.redirect("/login");
            return;
        } else {
            if (password != repassword) {
                var sess = req.session;
                sess.errorPass = password;
                res.redirect("/login");
            } else {
                const bcrypt = require("bcrypt");
                var salt = bcrypt.genSaltSync(10);
                var pass_mahoa = bcrypt.hashSync(password, salt);

                let user_info = { username: username, matkhau: pass_mahoa,email:email };
                let sql = "INSERT INTO users SET ?";
                db.query(sql, user_info);
                var sess = req.session;
                sess.username = username;
                sess.errorPass = false;
                sess.haveAcc = false;
                res.redirect("/");
            }
        }
    });
});
router.post("/accept", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    let sql = `SELECT * FROM users WHERE username = ? `;
    db.query(sql, [username], (err, rows) => {
        if (rows.length <= 0) {
            res.redirect("/login");
            return;
        }
        let user = rows[0];

        let pass_fromdb = user.matkhau;
        const bcrypt = require("bcrypt");
        var kq = bcrypt.compareSync(password, pass_fromdb);
        if (kq) {
            console.log("OK");
            var sess = req.session;
            sess.logined = true;
            sess.username = username;
            console.log(sess.username);
            res.redirect("/");
        } else {
            console.log("Not OK");
            res.redirect("/login");
        }
    });
});

router.get("/change", function (req, res) {
    res.render("pages/changePass", { confirm: false });
});
router.post("/doChange", function (req, res) {
    let username = req.session.username;
    let password = req.body.password;
    let repassword = req.body.password2;

    if (username) {
        if (password == repassword) {
            const bcrypt = require("bcrypt");
            var salt = bcrypt.genSaltSync(10);
            var pass_mahoa = bcrypt.hashSync(password, salt);

            let sql = `UPDATE users SET matkhau=? WHERE username = '${username}'`;
            db.query(sql, [pass_mahoa], function (err, result) {
                if (err) throw err;
                res.render("pages/changePass", { confirm: true });
            });
        } else {
            res.send("lỗi");
        }
    }
});

router.post("/forgot", function (req, res) {
    let email = req.body.email;
    let sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], function (err, rows) {
        if (err) throw err;
        if (rows.length <= 0) {
            let sess = req.session;
            sess.errorEmail = email;
            res.redirect("/login");
        } else {
            var result = "";
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var charactersLength = characters.length;

            for (var i = 0; i < 8; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            const bcrypt = require("bcrypt");
            var salt = bcrypt.genSaltSync(10);
            pass_mahoa = bcrypt.hashSync(result, salt);

            let sql = `UPDATE users SET matkhau = '${pass_mahoa}' WHERE email = '${email}'`;
            db.query(sql, function (err, rows) {
                if (err) throw err;
                var nodemailer = require("nodemailer");
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: { user: "phuckmps19413@fpt.edu.vn", pass: "farajina123" },
                    tls: { rejectUnauthorized: false },
                });

                var mailOptions = {
                    from: "phuckmps19413@fpt.edu.vn",
                    to: email,
                    subject: "Đổi mật khẩu",

                    html: `Mật khẩu mới là: ${result}`, //NộiDungThư, có thể có code html,
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) console.log(error);
                    else console.log("Đã gửi mail: " + info.response);
                    let sess = req.session;
                    sess.successEmail = email;
                    res.redirect("/login");
                });
            });
        }
    });
});

router.get("/logout", function (req, res) {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;
