var tick = function(io){

	var self = this;
	
	
	io.sockets.on('connection', function (socket) {
		socket.emit('news', { hello: 'world' });
		socket.on('my other event', function (data) {
			console.log(data);
		});
	});

}

exports.tick = tick;