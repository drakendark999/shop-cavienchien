var mysql = require('mysql');
const db = mysql.createConnection({
    host : 'bxupgpkwkdn45brom4lb-mysql.services.clever-cloud.com',
    user : 'uks4jjqmugpnzf4u',
    password:'0rG63ZsYipHxqMxfVGqR',
    database : 'bxupgpkwkdn45brom4lb'
})
db.connect(function(err) {    
    if (err) throw err;    
    console.log('Da ket noi database'); 
 }); 
module.exports = db;