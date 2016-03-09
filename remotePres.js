var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var io = require('socket.io').listen(app.listen(port, "0.0.0.0"));


app.use(express.static(__dirname + '/public'));

var secret = 'frederik';

var presentation = io.on('connection', function (socket) {

	socket.on('load', function(data){
		socket.emit('access', {
			access: (data.key === secret ? "granted" : "denied")
		});
	});

	socket.on('slide-changed', function(data){
		if(data.key === secret) {
			presentation.emit('navigate', {
				hash: data.hash
			});
		}
	});

});

console.log('remotePres draait nu op localhost:' + port);