var db = require("./connect");

exports.list = (callback) => {
    var sql = `SELECT * FROM product`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        callback(result);
    });
};

exports.create = (data, callback) => {
    let sql = `INSERT INTO product SET ?`;
    db.query(sql, data, (err, d) => {
        if (err) throw err;
        callback(d);
    });
};

exports.update = (id, data, callback) => {
    let sql = `UPDATE product SET ? WHERE id = ?`;
    db.query(sql, [data, id], (err, d) => {
        if (err) throw err;
        callback();
    });
};

exports.read = (id, callback) => {
    let sql = `SELECT * FROM product WHERE id = ?`;
    db.query(sql, id, (err, d) => {
        if (err) throw err;
        data = d[0];
        callback(data);
    });
};

exports.delete = (id, callback) => {
    let sql = `DELETE FROM product WHERE id = ?`;
    db.query(sql, id, (err, d) => {
        if (err) throw err;
        callback();
    });
};

// Views, Hot ,date

exports.views = (callback) => {
    let sql = `SELECT * FROM product ORDER BY view DESC LIMIT 0,4`;
    db.query(sql, (err, d) => {
        if (err) throw err;
        callback(d);
    });
};

exports.hot = (callback) => {
    let sql = `SELECT * FROM product WHERE hot = 1 ORDER BY view DESC  LIMIT 0,3`;
    db.query(sql, (err, d) => {
        if (err) throw err;
        callback(d);
    });
};

exports.baseOnCat = (id, callback) => {
    let sql = `SELECT * FROM product INNER JOIN category ON product.category_id =category.id WHERE product.category_id= ?`;
    db.query(sql, id, (err, d) => {
        if (err) throw err;
        callback(d);
    });
};

exports.date = (callback) => {
    let sql = `SELECT * FROM product  ORDER BY createDate DESC  LIMIT 0,3`;
    db.query(sql, (err, d) => {
        if (err) throw err;
        callback(d);
    });
};

exports.find = (word, callback) => {
    let sql = `SELECT * FROM product WHERE nameProduct LIKE '${word}';`;
    db.query(sql, (err, d) => {
        if (err) throw err;
        callback(d);
    });
};
