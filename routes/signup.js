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

    var sql = "INSERT INTO `user`(`username`,`useremail`,`password`,`mobilenum`,`first_name`,`last_name`,`created`) VALUES ('" + userData.username + "','" + userData.email + "','" + userData.password + "','" + userData.mobile + "','" + userData.first_name + "','" + userData.last_name + "','" + userData.created + "')";

    dao.connection.query(sql, function (err, result) {
        //res.redirect('profile/' + result.insertId);
        if (err) throw err;
        console.log(result);

    });

});
module.exports = router;