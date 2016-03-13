var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose/');
var bodyParser = require('body-parser');
var secret = 'frederik';


mongoose.connect('mongodb://localhost/passport');
var app = express();

var port = 3000;
var io = require('socket.io').listen(app.listen(port));
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

var UserDetails = mongoose.model('userInfo', UserDetail);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        process.nextTick(function () {
            UserDetails.findOne({'username':username}, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (user.password != password) { return done(null, false); }
                return done(null, user);
            });
        });
    }
));


app.get('/passports', function (req, res) {
    Users.find(function (err, todos) {
        if (err) res.send(err);
        else res.json(todos);
    });
});

app.post('/passport', function (req, res) {
    console.log('ontvangen in app.post!');
    var newUser = new UserDetails({
        username: req.body.username, 
        password: req.body.password
    });

    newUser.save(function (err) {
        if (err)res.send(err);
        res.status(200).end();
    });
});

app.delete('/passport/:id', function (req, res) {
    Users.remove({
        _id: req.params.id
    }, function (err, todo) {
        if (err)
        res.send(err);
        res.status(200).end();
    });
});

app.get('/loginFailure' , function (req, res, next){
    res.send('Failure to authenticate');
});

app.get('/loginSuccess' , function (req, res, next){
    res.send('Successfully authenticated');
});

app.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/loginSuccess',
        failureRedirect: '/loginFailure'
    })
);

var user = require('./routes/user');
console.log('remotePres draait nu op localhost:3000');