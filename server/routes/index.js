var express = require('express');
var router = express.Router();
var path = require('path');
var bCrypt = require('bcrypt-nodejs');
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

	/* POST profiel updaten */
	router.post('/editprofile/:id', function (req, res) {
        User.findOneAndUpdate({"_id": req.params.id}, {
                username: req.body.username,
                password: createHash(req.body.password2),
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }, {new: true}, 
            function(err, person) {
                if (err) {
                    console.log('got an error');
                } 
            }
        );
    });
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

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
                { presentaties: { presentatie: req.body.presTitle, maker: req.body.maker }}
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
                { 'presentaties.$.slides': { 
                    slidetitle: req.body.slideTitle, 
                    slidecontent: req.body.slideContent,
                    video: req.body.slideVideo,
                    image: req.body.slideImage,
                    background: req.body.slideBackground,
                    code: req.body.slideCode
                }}
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
    
    router.delete('/delete/:id', function (req, res) {
        User.remove({ _id: req.params.id }, function (err, user) {
            if (err)
                res.send(err);
            res.status(200).end();
        });
    });
    
    router.delete('/deletepres/:id/:name', function (req, res) {
        User.update(
            { _id: req.params.id },
            { $pull:
                { presentaties: { presentatie: req.params.name }}
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
    
    router.delete('/deleteslide/:id/:name/:slide', function (req, res) {
        User.update(
            { _id: req.params.id, 'presentaties.presentatie': req.params.name },
            { $pull:
                { 'presentaties.$.slides': { slidetitle: req.params.slide }}
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
    
	return router;
};