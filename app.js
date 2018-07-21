var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var eventRouter = require('./routes/events');
var addEventRouter = require('./routes/addEvent');
var loginRouter = require('./routes/login');
var signUpRouter = require('./routes/signUp');
var paymentRouter = require('./routes/payment');
var adminRouter = require('./routes/adminPage');
var dao = require('./routes/dao');
var flash = require("connect-flash");
var logoutRouter = require('./routes/logout');

var busboy = require("then-busboy");
var fileUpload = require('express-fileupload');
var bodyParser = require("body-parser");
var multer = require('multer');
var app = express();


//Authentication Setup

var session = require('express-session');
var passport = require('passport');
const expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));
app.use(express.static(path.join(__dirname, 'public/javascripts')));
app.use(fileUpload());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.use(multer({dest:'./public/uploads/'}).single('file'));
app.use(flash());
//Authentication Middleware

var options = {
    host: 'localhost',
    user: 'root',
    password: 'Tammy20130707',
    database: 'ogaDatabase'
};

var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'randomcharacterset',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req,res);
    next();
});


// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/events', eventRouter);
app.use('/addEvent', addEventRouter);
app.use('/login', loginRouter);
app.use('/signUp', signUpRouter);
app.use('/payment', paymentRouter);
app.use('/adminPage', adminRouter);
app.use('/logout', logoutRouter);

passport.use(new LocalStrategy(
    function (username, password, done) {

        dao.connection.query('SELECT password FROM user WHERE username = ?', username, function (err, results, fields) {
            if (err) {
                done(err)
            }
            ;

            var obj = JSON.parse(JSON.stringify(results));
            console.log(results);
            if (results.length === 0) {
                return done(null, false, {message:'Incorrect Credentials'})
            }
            else if (obj[0].password === password) {
                return done(null, {user_id: username});
            } else if (obj[0].password != password) {
                return done(null, false, {message: 'Incorrect Password'})
            }
        });
    }
));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
