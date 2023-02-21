var db = require('./connect');

exports.list = (callback) => {
    var sql = `SELECT * FROM product`
    db.query(sql,(err, d)=>{
        if (err) throw err
        callback(d)
    })
}