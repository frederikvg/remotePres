var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose/');
var bodyParser = require('body-parser');
var secret = 'frederik';


mongoose.connect('mongodb://localhost/passport');
var app = express();

var port = process.env.PORT || 3000;
var io = require('socket.io').listen(app.listen(port, "0.0.0.0"));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session()); 
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use('/scripts/', express.static(__dirname + '/node_modules'));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

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

var Schema = mongoose.Schema;


var UserDetail = new Schema({
    username: String,
    password: String
}, {collection: 'userInfo'});

var UserDetails = mongoose.model('userInfo',UserDetail);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(new LocalStrategy(
  function(username, password, done) {
   
    process.nextTick(function () {
    UserDetails.findOne({'username':username},
    function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
    });
  }
));



app.get('/auth', function(req, res, next) {
  res.sendfile('views/login.html');
});


app.get('/loginFailure' , function(req, res, next){
  res.send('Failure to authenticate');
});

app.get('/loginSuccess' , function(req, res, next){
  res.send('Successfully authenticated');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  }));

console.log('ToDo-App draait nu op localhost:3000');


