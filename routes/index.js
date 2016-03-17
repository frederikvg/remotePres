var express = require('express');
var router = express.Router();
var path = require('path');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
};

module.exports = function(passport){

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/#/secure',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
        res.sendfile(path.join(__dirname, '../public/views/', 'login.html'));
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/#/secure',
		failureRedirect: '/signup',
		failureFlash : true  
	}));
    
    router.get('/secure', isAuthenticated, function(req, res) {
        res.redirect('/#/secure');
    });

	/* Handle Logout */
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
            user: req.user.firstName + ' ' + req.user.lastName
        });
    });
    
	return router;
}





