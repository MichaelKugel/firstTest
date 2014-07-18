// Title: Fork and Record WebRTC (main.js JavaScript component)
// Author: Michael Kugel (mkugel@tssg.org)
// Date: 30th June 2014
// Version 0.1.0
//
// Copyright (c) 2014, WATERFORD INSTITUTE OF TECHNOLOGY (TSSG)
//
// All rights reserved.
//
// This project is making use of RecordRTC by Muaz Khan under MIT licence.
// All other code that is not inside RecordRTC was develped by Michael Kugel (3MT, TSSG, WIT) (c) 2014
// This is a demo for WebRTC audio and video stream recording and replay. Main focus on using Google Chrome.
// Some experimental code is added for firefox and the use of TURN server technology for ICE (not complete).
// If you want to use any part of this code, please contact mkugel@tssg.org.

var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(2014);


// var express = require('express');
// var app = express();
// console.log(express.static(__dirname + '/js'));
// app.use(express.static(__dirname + '/js'));
// app.all('*', function(req, res){
// 	res.sendfile("index.html");
// });

// app.listen(9000);


var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket){

	function log(){
		var array = [">>> "];
	  for (var i = 0; i < arguments.length; i++) {
	  	array.push(arguments[i]);
	  }
	    socket.emit('log', array);
	}

	socket.on('message', function (message) {
		log('Got message: ', message);
		socket.broadcast.emit('message', message); // should be room only
	});

	socket.on('create or join', function (room) {
		var numClients = io.sockets.clients(room).length;

		log('Room ' + room + ' has ' + numClients + ' client(s)');
		log('Request to create or join room', room);

		if (numClients == 0){
			socket.join(room);
			socket.emit('created', room);
		} else if (numClients == 1) {
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		} else { // max two clients
			socket.emit('full', room);
		}
		socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
		socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

	});

});

