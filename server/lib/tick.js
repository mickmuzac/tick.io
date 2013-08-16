var listen = function(io){

	var self = this;
	var socketMap = {};
	
	io.sockets.on('connection', function (socket) {
		
		console.log("New connection", socket.id);
		
		var oldDate = Date.now();
		socketMap[socket.id] = {socket:socket, latency:0, lastTime:0};
		
		//This sends entire socket pool. Own ID is filtered out on front end.
		socket.broadcast.emit('new', {pool:Object.keys(socketMap), origin: socket.id});
		socket.emit('confirm', {pool:Object.keys(socketMap), origin: socket.id});
		
		socketMap[socket.id].lastTime = Date.now();
		socket.emit('ping', 0);
		
		socket.on('data', function (data) {
			console.log(socket.id, data, (Date.now()-oldDate));
			oldDate = Date.now(); 
			
			socket.broadcast.emit('data', {pool:Object.keys(socketMap), origin: socket.id, tick: data.tick, data:data.client_data});
		});		
		
		socket.on('ping', function (data) {
			socketMap[socket.id].latency = Date.now() - socketMap[socket.id].lastTime;
			console.log("RTT is about " + socketMap[socket.id].latency + "ms");
		});
		
		socket.on('disconnect', function(){
			console.log(socket.id, 'disconnected');

			delete socketMap[socket.id];
			socket.broadcast.emit('gone', {pool:Object.keys(socketMap), origin: socket.id}); 
			
			//console.log(socketMap);
		})
	});
}

exports.listen = listen;