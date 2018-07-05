var express = require('express');
var router = express.Router();
var dao = require('./dao');
var mysql = require('mysql');
var path = require('path');

var events = [];
/* GET home page. */

router.get('/', function(req, res, next) {
    var eventArray = [];
    dao.viewEvents.select( function (err, results) {
        if (err == 'error') {
            console.log(err);
        } else {
            //console.log(JSON.parse(JSON.stringify(results)));
            for(var i=0; i<results.length; i++)
            {
                //i.push();
                var obj = JSON.parse(JSON.stringify(results[i]))
                eventArray.push(obj);
                console.log(eventArray);
                //console.log(obj[i].Image.data);

            }
            res.render('events', { title: 'Events', posts: eventArray });
        }
    });

});

module.exports = router;