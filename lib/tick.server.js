var catchAllCb, ioRef, socketMap = {};

var on = function(event, cb){
	io.sockets.on(event, cb);
};

function listen(io, cb){

	var self = this;
	catchAllCb = cb ? cb : function(){};
	ioRef = io;
	
	io.sockets.on('connection', function (socket) {

		var oldDate = Date.now(), thisDataObj, currentPing = 0, maxPingCount = 20;
		
		socketMap[socket.id] = {socket:socket, latency: {total: 0, time: 0}, lastTime:0, dataCache: {pool:[], origin: "", tick: -1, client_data: null}};
		thisDataObj = socketMap[socket.id].dataCache;
		
		console.log("New connection", socketMap);
		
		//This sends entire socket pool. Own ID is filtered out on front end.
		thisDataObj.pool = Object.keys(socketMap);
		thisDataObj.origin = socket.id;
		socket.broadcast.emit('new', thisDataObj);
		socket.emit('confirm', thisDataObj);
		
		testLatency(socket, maxPingCount);
		
		socket.on('data', function (data) {
			//console.log(socket.id, data, (Date.now()-oldDate));
			oldDate = Date.now(); 
			
			thisDataObj.pool = Object.keys(socketMap);
			thisDataObj.origin = socket.id;			
			thisDataObj.tick = data.tick;
			thisDataObj.data = data.client_data;
			socket.broadcast.emit('data', thisDataObj);
		});		
		

		
		socket.on('disconnect', function(){
			console.log(socket.id, 'disconnected');
			
			thisDataObj.pool = Object.keys(socketMap);
			thisDataObj.origin = socket.id;	
			
			socket.broadcast.emit('gone', thisDataObj); 
			thisDataObj = null;
			delete socketMap[socket.id];
		});
		
		
	});
}
function testLatency(socket, numTimes, currentCount){
	
	currentCount = currentCount ? currentCount : 0;
	socket.on('ping', function (data) {
		var temp = socketMap[socket.id].latency, currentLast = (Date.now() - socketMap[socket.id].lastTime);
		
		//Calculate rolling average
		temp.time = (temp.time * temp.total + currentLast) / (++temp.total);
		console.log("RTT is about " + currentLast + "ms. Avg: " + socketMap[socket.id].latency.time + "ms" + " " + currentCount);
		
		sendData(function(){});
		
		if(currentCount < numTimes){
			currentCount++;
			socketMap[socket.id].lastTime = Date.now();
			socket.emit('ping', 0);
		}
		
		return;
	});
	
	socketMap[socket.id].lastTime = Date.now();
	socket.emit('ping', 0);
}

function sendData(cb){
	var arr = [], highestLatency = 1;
	
	for(var key in socketMap){
		arr.push(socketMap[key].latency);
		
		if(highestLatency < socketMap[key].latency.time){
			highestLatency = socketMap[key].latency.time;
		}
	}
	
	for(var key in socketMap){
		setTimeout(function(){
			emit(socketMap[key].socket, arr);
		}, highestLatency - socketMap[key].latency.time + 1); 
	}
	
	
	console.log("Data sent");
	cb();
}

function emit(socket, data){
	socket.emit('data', {pool:Object.keys(socketMap), origin: "server", tick: 100, data:data});
}

exports.listen = listen;











