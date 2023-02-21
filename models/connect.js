var mysql = require('mysql');
const db = mysql.createConnection({
    host : '103.200.23.139',
    user : 'caviench_fpoly',
    password:'123456789cavienchien',
    database : 'caviench_fpoly'
})
db.connect(function(err) {    
    if (err) throw err;    
    console.log('Da ket noi database'); 
 }); 
module.exports = db;