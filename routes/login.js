var express = require('express');
var router = express.Router();
var dao = require('./dao');
var LocalStrategy = require('passport-local').Strategy;

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
        console.log(obj);
        if (err) throw err;
        if(obj.length > 0) {
            if (obj[0].Password == userData.password) {
                console.log('User Logged In');
                var roleSql  = 'SELECT * FROM USER_ROLE WHERE USERID=?';
                dao.connection.query(roleSql, obj[0].UserID, function(err, result){
                    if (err) throw err;
                    var roleObj = JSON.parse(JSON.stringify(result));
                    console.log(roleObj)
                    if(roleObj.RoleID=1){
                        res.redirect('/adminPage');
                    } else {
                        res.redirect('/');
                    }
                })
            } else {
                console.log('Invalid Credentials');
            }
        } else {
            console.log('Username Not Found');
        }
    })

});
module.exports = router;