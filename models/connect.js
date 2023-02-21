var mysql = require('mysql');
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'asmnodejs'
})
db.connect(function(err) {    
    if (err) throw err;    
    console.log('Da ket noi database'); 
 }); 
module.exports = db;