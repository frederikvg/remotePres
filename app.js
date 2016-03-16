var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var secret = 'frederik';

var mongoose = require('mongoose/');
// Connect to DB
mongoose.connect('mongodb://localhost/remotepres');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/public/views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'master'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

// Define routes
var routes = require('./routes/index')(passport);
app.use('/', routes);

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, 'public/views/', 'index.html'));
});

// Define 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.jade', {
            message: err.message,
            error: err
        });
    });
}

// Configuring socket.io
var port = 3000;
var io = require('socket.io').listen(app.listen(port));
var presentation = io.on('connection', function (socket) {
    socket.on('load', function (data) {
        socket.emit('access', {
            access: (data.key === secret ? "granted" : "denied")
        });
    });
    socket.on('slide-changed', function (data) {
        if (data.key === secret) {
            presentation.emit('navigate', {
                hash: data.hash
            });
        }
    });
});

console.log('remotePres draait nu op localhost:' + port);
module.export = app;