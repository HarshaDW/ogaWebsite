var express = require('express');
var router = express.Router();
var dao = require('./dao');
var mysql = require('mysql');
var busboy = require("then-busboy");
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest: 'public/images/Uploads'});
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
var sms = require('./sms');

router.get('/', function(req, res, next) {
    res.render('signup');
});

router.post('/signUpSubmit', function (req, res) {

    var today = new Date();

    Date.prototype.toShortFormat = function() {

        var month_names =["01","02","03",
            "04","05","06",
            "07","08","09",
            "10","11","12"];

        var day = this.getDate();
        var month_index = this.getMonth();
        var year = this.getFullYear();

        return "" + year + "-" + month_names[month_index] + "-" + day;
    };

    var message = '';
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

    let insertedID;
    var mobileWithExtention = '+94'+userData.mobile;

    var sql = "INSERT INTO `user`(`username`,`useremail`,`password`,`mobilenum`,`first_name`,`last_name`,`created`) VALUES ('" + userData.username + "','" + userData.email + "','" + userData.password + "','" + mobileWithExtention + "','" + userData.first_name + "','" + userData.last_name + "','" + userData.created + "')";

    dao.connection.query(sql, function (err, result) {
        ;
        if (err) throw err;
        console.log(result);
        var obj = JSON.parse(JSON.stringify(result))
        insertedID = obj.insertId;
        var updateUserRoleSQL = "INSERT INTO `user_role`(`userID`,`RoleID`) VALUES ('" + insertedID + "','" + 2 + "')";
        dao.connection.query(updateUserRoleSQL, function(err, result){
            if (err) throw err;
            console.log(result);
        })

        const file = req.files.paymentImage;
        const imagePath = file.name;

        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {

            file.mv('public/images/PaymentUploads/' + file.name, function (err) {

                if (err)
                    return res.status(500).send(err);
                console.log(err);
                var sql = "INSERT INTO `payment`(`paymentDate`,`image`,`UserID`) VALUES ('" + today.toShortFormat() + "','" + imagePath + "','" + insertedID + "')";

                dao.connection.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log(result);
                });
            });
        } else {
            message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
            res.send("Wont Upload" + message);
        }

    });
        res.redirect('/login')
});
module.exports = router;