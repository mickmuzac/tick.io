var $tickjs = new function(){

	var self = this;
	var master = false;
	var ticks = 0;
	var hours = 0;
	var socket;
	var timeoutHandle = 0;
	var lastTime = 0;
	var keepLooping;
	var totalTicks = 0;
	var dataBuffer = {};
	
	//Number of milliseconds per tick
	self.tickInterval = 10; 
	self.data = {};
	
	self.connect = function(addr){
	
		socket = io.connect(addr);
		socket.on('confirm', function (data) {
			console.log(data);
			socket.emit('data', { tick:totalTicks, data:self.data });
		});
		
		return self;
	}

	self.sync = function(){
		
		totalTicks++;
		console.log("sync", Date.now()-lastTime);
		lastTime = Date.now();
		socket.emit('my other event', {tick:totalTicks, data:self.data});
		
		console.log(socket);
		data = dataBuffer;
	};

	self.setData = function(data){
		self.data = data;
	};
	
	self.getData = function(){
		return dataBuffer;
	};
	
	
	self.start = function(server){
	
		
	};
	
	self.stop = function(){
		keepLooping = false;
		window.clearTimeout(timeoutHandle);
	};
	
	self.every = function(interval){
		
		lastTime = Date.now();
		keepLooping = true;
		self.tickInterval = interval;

		(function loop(){
			timeoutHandle = setTimeout(function(){
			self.sync();
			
			if(keepLooping){
				loop();
			}

		  }, interval);
		})();
		
		return self;
	};
	
	if (!Date.now) {  
		Date.now = function() {  
			return +(new Date);  
		};  
	}  
};

if(!tick){
	var tick = $tickjs;
}