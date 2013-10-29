var catchAllCb;

var on = function(event, cb){
	io.sockets.on(event, cb);
};

var listen = function(io, cb){

	var self = this, socketMap = {};
	catchAllCb = cb ? cb : function(){};
	
	io.sockets.on('connection', function (socket) {
		
		console.log("New connection", socket.id);
		var oldDate = Date.now(), thisSocketMap;
		
		socketMap[socket.id] = {socket:socket, latency:0, lastTime:0, dataCache: {pool:[], origin: "", tick: -1, client_data: null}};
		thisSocketMap = socketMap[socket.id].dataCache;
		
		console.log("New connection", socketMap);
		
		//This sends entire socket pool. Own ID is filtered out on front end.
		thisSocketMap.pool = Object.keys(socketMap);
		thisSocketMap.origin = socket.id;
		socket.broadcast.emit('new', thisSocketMap);
		socket.emit('confirm', thisSocketMap);
		
		socketMap[socket.id].lastTime = Date.now();
		socket.emit('ping', 0);
		
		socket.on('data', function (data) {
			console.log(socket.id, data, (Date.now()-oldDate));
			oldDate = Date.now(); 
			
			thisSocketMap.pool = Object.keys(socketMap);
			thisSocketMap.origin = socket.id;			
			thisSocketMap.tick = data.tick;
			thisSocketMap.data = data.client_data;
			socket.broadcast.emit('data', thisSocketMap);
		});		
		
		socket.on('ping', function (data) {
			socketMap[socket.id].latency = Date.now() - socketMap[socket.id].lastTime;
			console.log("RTT is about " + socketMap[socket.id].latency + "ms");
		});
		
		socket.on('disconnect', function(){
			console.log(socket.id, 'disconnected');
			
			thisSocketMap.pool = Object.keys(socketMap);
			thisSocketMap.origin = socket.id;	
			
			socket.broadcast.emit('gone', thisSocketMap); 
			thisSocketMap = null;
			delete socketMap[socket.id];
		});
	});
};

exports.listen = listen;