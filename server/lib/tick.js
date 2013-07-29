var listen = function(io){

	var self = this;
	var socketPool = [];
	
	io.sockets.on('connection', function (socket) {
		console.log("New connection", socket.id);
		socketPool.push(socket);
		socket.broadcast.emit('new', socket.id);
		
		socket.on('data', function (data) {
			//socket.
			console.log(socket.id, data);
		});
		
		socket.on('disconnect', function(){
			console.log(socket.id, 'disconnected');
			socket.broadcast.emit('gone', socket.id);
		})
	});
}

exports.listen = listen;