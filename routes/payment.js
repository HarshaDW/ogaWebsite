var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dao = require('./dao');
var busboy = require("then-busboy");
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest: 'public/images/Uploads'});
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
var sms = require('./sms');

router.get('/', function(req, res, next) {
    res.render('payment');
});

router.post('/addPayment', urlencodedParser, function (req, res) {

    var createPayment = {
        user: req.body.userid;
        img: req.body.paymentImage;

    }

    var file = req.files.paymentImage;
    var imagePath = file.name;

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {

        file.mv('public/images/PaymentUpload/' + file.name, function (err) {

            if (err)

                return res.status(500).send(err);
            var sql = "INSERT INTO `payment`(`paymentDate`,`image`,`UserID`) VALUES ('" + createEvent.name + "','" + createEvent.description + "','" + imagePath + "','" + createEvent.date + "')";

            dao.connection.query(sql, function (err, result) {
                //res.redirect('profile/' + result.insertId);
                if (err) throw err;
                console.log(result);

            });
        });
    } else {
        message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
        //res.render('index.ejs', {message: message});
        res.send("Wont Upload" + message);
    }

    res.send('creating payment')
});

module.exports = router;