var listen = function(io){

	var self = this;
	var socketMap = {};
	
	io.sockets.on('connection', function (socket) {
		
		console.log("New connection", socket.id);
		socketMap[socket.id] = socket;
		
		//DO NOT SEND A POOL LIST CONTAINING OWN ID
		socket.broadcast.emit('new', {pool:Object.keys(socketMap), id: socket.id});
		
		socket.on('data', function (data) {
			console.log(socket.id, data);
		});
		
		socket.on('disconnect', function(){
			console.log(socket.id, 'disconnected');

			delete socketMap[socket.id];
			socket.broadcast.emit('gone', {pool:Object.keys(socketMap), id: socket.id}); 
			
			console.log(socketMap);
		})
	});
}

exports.listen = listen;