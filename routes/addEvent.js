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

var config = require('../twilioConfig.json');
const accountSid = config.twilioSID;
const authToken = config.twilioAuthToken;

const client = require('twilio')(accountSid, authToken);

var app = express();


router.get('/', function (req, res, next) {
    res.render('addEvent', {title: 'Add Event'});
});


router.post('/newEvent', urlencodedParser, function (req, res) {
    var message = '';
    // this is where you handle the POST request.
    var createEvent = {
        name: req.body.event,
        description: req.body.description,
        date: req.body.date,
        send: req.body.sendSMS
    };

    var file = req.files.eventImage;
    var imagePath = file.name.split('/\ /').join('\ ');
    console.log(imagePath);

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {

        file.mv('public/images/Uploads/' + file.name, function (err) {

            if (err)

                return res.status(500).send(err);
            var sql = "INSERT INTO `event`(`name`,`description`,`image`,`date`) VALUES ('" + createEvent.name + "','" + createEvent.description + "','" + imagePath + "','" + createEvent.date + "')";

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

    if (createEvent.send != 'undefined' && createEvent.send == 'SMS') {
        var phoneNumbers = [];
        dao.getPhoneNumbers.getPhone(function (err, results) {
            if (err == 'error') {
                console.log(err);
            } else {
                //console.log(JSON.parse(JSON.stringify(results)));
                for (var i = 0; i < results.length; i++) {
                    //i.push();
                    var obj = JSON.parse(JSON.stringify(results[i]))
                    //console.log(obj.MobileNum);
                    phoneNumbers.push(obj.MobileNum);
                }
            }

            for (var i = 0; i < phoneNumbers.length; i++) {
                var messageBody = 'Event ' + createEvent.name + ' will be held on ' + createEvent.date + ' organized by OGA association. Be there to witness great fun. Call us 0112781493';
                console.log(messageBody);
                client.messages.create({
                    to: phoneNumbers[i], // You can only send messages to verified numbers in trial

                    from: config.twilioPhoneNumber, // https://i.imgur.com/gf0Ujid.png

                    body: messageBody
                }, function (err, message) {
                    if (err) throw err;
                    console.log(message.sid);
                });
            }
            res.send('Message Sent To All Registered Users');

        })

    }
    res.redirect('/')
})

module.exports = router;
