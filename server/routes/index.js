var express = require('express');
var router = express.Router();
var path = require('path');
var Slide = require('../models/slide');

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
    
    router.post('/addpres', function(req, res) {
        var newPres = new Slide({
           presentatie: req.body.presTitle
        })
        
        newPres.save(function (err) {
            if (err) {
                res.send(err);
                console.log('error');
            }
            res.status(200).end();
        })
    });
    
    router.post('/addpres/:id', function(req, res) {
        Slide.update({ presentatie: req.params.id },
            {$push:{slides: {
                slidetitle: req.body.slideTitle, 
                slidecontent: req.body.slideContent
            }}},{upsert:true}, function(err, data) { 
        });
    });
    
    router.get('/slides', function (req, res) {
        Slide.find(function (err, slides) {
            if (err) res.send(err);
            else res.json(slides);
        });
    });
    
	return router;
}



