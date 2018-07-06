var express = require('express');
var router = express.Router();
var dao = require('./dao');

router.get('/', function(req, res, next) {
    res.render('signup');
});

router.post('/signUpSubmit', function (req, res) {

    var today = new Date();
    var appData = {error:1,data: ''};
    var userData = {
        first_name: req.body.firstname,
        last_name:req.body.lastname,
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
        mobile:req.body.mobilenum,
        created:today
    }

    console.log(userData);
    var mobileWithExtention = '+94'+userData.mobile;

    var sql = "INSERT INTO `user`(`username`,`useremail`,`password`,`mobilenum`,`first_name`,`last_name`,`created`) VALUES ('" + userData.username + "','" + userData.email + "','" + userData.password + "','" + mobileWithExtention + "','" + userData.first_name + "','" + userData.last_name + "','" + userData.created + "')";

    dao.connection.query(sql, function (err, result) {
        ;
        if (err) throw err;
        console.log(result);
        var obj = JSON.parse(JSON.stringify(result))
        console.log(obj.insertId);
        var updateUserRoleSQL = "INSERT INTO `user_role`(`userID`,`RoleID`) VALUES ('" + obj.insertId + "','" + 2 + "')";
        dao.connection.query(updateUserRoleSQL, function(err, result){
            if (err) throw err;
            console.log(result);
        })
        res.redirect('/login')

    });

});
module.exports = router;