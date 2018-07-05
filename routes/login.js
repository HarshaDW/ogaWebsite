var express = require('express');
var router = express.Router();
var dao = require('./dao');

router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/loginUser', function (req, res) {

    var today = new Date();
    var appData = {error:1,data: ''};
    var userData = {
        username:req.body.username,
        password:req.body.password,
    }

    console.log(userData);

    var sql = 'SELECT * FROM USER WHERE USERNAME=?';

    dao.connection.query(sql, userData.username, function (err, result) {
        //res.redirect('profile/' + result.insertId);
        var obj = JSON.parse(JSON.stringify(result));
        if (err) throw err;
        if(obj.length > 0) {
            if (obj[0].Password == userData.password) {
                console.log('User Logged In');
            } else {
                console.log('Invalid Credentials');
            }
        } else {
            console.log('Username Not Found');
        }
    })

});
module.exports = router;