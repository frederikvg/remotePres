var express = require('express');
var router = express.Router();
var path = require('path');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
};

module.exports = function(passport) {

	/* GET login pagina. */
	router.get('/', function(req, res) {
        res.sendfile(path.join(__dirname, '../../client/views/', 'index.html'));
	});

	/* Login POST verwerken*/
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/#/home',
		failureRedirect: '/#/login',
		failureFlash : true  
	}));

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/#/home',
		failureRedirect: '/login',
		failureFlash : true  
	}));

	/* Logout verwerken */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
    
    router.get('/status', function (req, res) {
        if (!req.isAuthenticated()) {
                console.log('geen toegang');
            return res.status(200).json({
                status: false
            });
        }
        res.status(200).json({
            status: true,
            user: req.user
        });
    });
    
	return router;
}





