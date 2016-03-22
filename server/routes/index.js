var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
    }
	res.redirect('/');
};

module.exports = function (passport) {

	/* GET login pagina. */
	router.get('/', function (req, res) {
        res.sendfile(path.join(__dirname, '../../client/views/', 'index.html'));
	});

    /* GET reveal pagina. */
    router.get('/reveal', function (req, res) {
        res.sendfile(path.join(__dirname, '../../client/views/', 'reveal.html'));
    });

	/* POST login verwerken*/
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/#/home',
		failureRedirect: '/#/login',
		failureFlash : true
	}));

	/* POST registratie verwerken */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/#/home',
		failureRedirect: '/login',
		failureFlash : true
	}));

	/* Logout verwerken */
	router.get('/signout', function (req, res) {
		req.logout();
		res.redirect('/');
	});
    
    /* GET user gegevens */
    router.get('/status', function (req, res) {
        if (!req.isAuthenticated()) {
            return res.status(200).json({
                status: false
            });
        } else {
            res.status(200).json({
                status: true,
                user: req.user
            });
        }
    });
    
    /* Vind presentaties op naam */
    router.get('/pres/:titel', function (req, res) {
        User.findOne(
            { 'presentaties.presentatie': req.params.titel },
            { 'presentaties.$': 1 },
            function (err, pres) {
                console.log(pres);
                if (err) {
                    res.send(err);
                } else if (pres) {
                    res.status(200).json(pres.presentaties[0]);
                }
            }
        );
    });
    
    /* POST presentatie titel, zoek op userID */
    router.post('/addpres/:id', function (req, res) {
        User.update(
            { _id: req.params.id },
            { $push:
                { presentaties: { presentatie: req.body.presTitle }}
            },
            { upsert: true },
            function (err, pres) {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).json(pres);
                }
            }
        );
    });
    
    /* POST slides, zoek op userID en naam presentatie */
    router.post('/addslide/:id/:name', function (req, res) {
        User.update(
            { _id: req.params.id, 'presentaties.presentatie': req.params.name },
            { $push:
                { 'presentaties.$.slides': { slidetitle: req.body.slideTitle, slidecontent: req.body.slideContent }}
            },
            { upsert: true },
            function (err, slides) {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).json(slides);
                }
            }
        );
    });
    
    /* Haal gegevens van presentaties per gebruiker op */
    router.get('/findpres/:id', function (req, res) {
        User.findOne({ '_id': req.params.id }, function (err, pres) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(pres);
            }
        });
    });
    
	return router;
};