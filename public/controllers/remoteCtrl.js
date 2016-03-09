'use strict';

var remoteCtrl = angular.module('remoteCtrl', []);

remoteCtrl.controller('remoteCtrl', [function () {

    Reveal.initialize({
        history: true
    });

    var socket = io();
    var form = $('form.login');
    console.log(form);
    var secretTextBox = form.find('input[type=password]');
    console.log(secretTextBox);
    var presentation = $('.reveal');
    var key;
    var animationTimeout;

    form.submit(function (e){
        e.preventDefault();

        key = secretTextBox.val().trim();
        console.log('pass' + key);
        if (key.length) {
            socket.emit('load', {
                key: key
            });
        }
    });

    socket.on('access', function (data) {
        if (data.access === "granted") {
            presentation.removeClass('blurred');
            form.hide();
            var ignore = false;

            $(window).on('hashchange', function () {
                if (ignore) {
                    return;
                }

                var hash = window.location.hash;

                socket.emit('slide-changed', {
                    hash: hash,
                    key: key
                });
            });

            socket.on('navigate', function (data) {
                window.location.hash = data.hash;
                ignore = true;

                setInterval(function () {
                    ignore = false;
                }, 100);
            });
        } else {
            clearTimeout(animationTimeout);
            secretTextBox.addClass('denied animation');
            animationTimeout = setTimeout(function () {
                secretTextBox.removeClass('animation');
            }, 1000);
            form.show();
        }
    });
}]);