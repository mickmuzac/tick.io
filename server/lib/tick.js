var listen = function(io){

	var self = this;
	var socketMap = {};
	
	io.sockets.on('connection', function (socket) {
		
		console.log("New connection", socket.id);
		var oldDate = Date.now();
		socketMap[socket.id] = {socket:socket, latency:0};
		
		//This sends entire socket pool. Own ID is filtered out on front end.
		socket.broadcast.emit('new', {pool:Object.keys(socketMap), id: socket.id});
		socket.emit('confirm', {pool:Object.keys(socketMap), id: socket.id});
		
		socket.on('data', function (data) {
			
			console.log(socket.id, data, (Date.now()-oldDate));
			oldDate = Date.now(); 
		});
		
		socket.on('disconnect', function(){
			console.log(socket.id, 'disconnected');

			delete socketMap[socket.id];
			socket.broadcast.emit('gone', {pool:Object.keys(socketMap), id: socket.id}); 
			
			//console.log(socketMap);
		})
	});
}

exports.listen = listen;