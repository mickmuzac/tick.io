var $tickjs = new function(){

	var self = this;
	var master = false,
	socket,
	keepLooping,
	dataBuffer = {},
	isConnected = false,
	timeoutHandle = 0;
	
	//Number of milliseconds per tick
	self.tickRate = 10; 
	self.data = {};
	
	self.connect = function(addr){
	
		socket = io.connect(addr);
		socket.on('confirm', function (data) {
			isConnected = true;
			console.log(data);
			socket.emit('data', { tick:self.time.ticks, data:self.data });
		});
		
		socket.on('new', function(data){
			console.log('new', data);
		});		
		socket.on('gone', function(data){
			console.log('disconnected', data);
		});
		
		return self;
	}

	self.sync = function(){
		
		self.time.ticks++;
		console.log("sync", Date.now()-self.time.lastTime);
		self.time.lastTime = Date.now();
		
		//Send data back up to the server
		socket.emit('data', {tick:self.time.ticks, data:self.data});
		
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
	
	self.every = function(rate){
		
		self.time.lastTime = Date.now();
		keepLooping = true;
		self.tickRate = rate;

		(function loop(){
			timeoutHandle = setTimeout(function(){
			self.sync();
			
			if(keepLooping){
				loop();
			}

		  }, rate);
		})();
		
		return self;
	};
	
	self.time = {
		ticks: 0,
		hours: 0,
		lastTime: 0,
		lastRead: 0,
		getTickDiff: function(){
			var temp = this.ticks - this.lastRead;
			this.lastRead = this.ticks;
			return temp;
		},		
		getTimeDiff: function(){
			var temp = this.ticks - this.lastRead;
			this.lastRead = this.ticks;
			return (temp * self.tickRate) * .001;
		}		
	
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