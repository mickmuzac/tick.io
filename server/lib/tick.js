var listen = function(io){

	var self = this;
	var socketPool = [];
	
	io.sockets.on('connection', function (socket) {
		console.log("New connection", socket.id);
		socketPool.push(socket.id);
		
		//DO NOT SEND A POOL LIST CONTAINING OWN ID
		socket.broadcast.emit('new', {pool:socketPool, id: socket.id});
		
		socket.on('data', function (data) {
			//socket.
			console.log(socket.id, data);
		});
		
		socket.on('disconnect', function(){
			console.log(socket.id, 'disconnected');
			
			socketPool.splice(socketPool.indexOf(socket.id), 1);
			socket.broadcast.emit('gone', {pool:socketPool, id: socket.id});
			
		})
	});
}

exports.listen = listen;