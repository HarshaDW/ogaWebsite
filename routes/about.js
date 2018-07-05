var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dao = require('./dao');

var app = express();
var dbData = {};
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('about', { title: 'About Us' , db: dbData});
});



var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Tammy20130707',
    database : 'ogaDatabase'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    //dao.queryForPermissions(connection);

    console.log('connected as id ' + connection.threadId);
})

module.exports = router;
