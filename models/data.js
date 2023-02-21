var db = require('./connect');
exports.getData = (data,callback)=>{
    var sql = `SELECT * from ${data}`;
    db.query(sql, function(err,results){
        if (err) throw err;
        callback(results)
    })
}

exports.getHotData = (data,callback)=>{
    let sql = `SELECT * FROM ${data} WHERE hot = 1 ORDER BY view DESC  LIMIT 0,3`;
    db.query(sql,(err, d)=>{
        if(err) throw err
        callback(d)
    })
}

exports.getViewData = (data,callback)=>{
    let sql = `SELECT * FROM ${data} ORDER BY view DESC LIMIT 0,4`;
    db.query(sql,(err, d)=>{
        if(err) throw err
        callback(d)
    })
}

exports.detail = (id,data,callback)=>{
    var sql = `SELECT * from ${data} WHERE id = ${id}`;
    db.query(sql,id,(err,d)=>{
        if (err){
            throw err
        } else {
            data = d[0];
            let sql2 = `UPDATE product SET view=view+1 WHERE id = ${id}`;
            db.query(sql2,(err, d)=>{
                if (err){
                    throw err
                }else{
                    callback(data)
                }     
            })
        } 
    })
}
