var $tickjs = new function(){

	var self = this;
	var master = false,
	socket = {},
	sessionPool = [],
	keepLooping = false,
	dataBuffer = {},
	isConnected = false,
	timeoutHandle = 0,
	totalConnected = 0,
	desiredConnections = 0,
	desiredRate = 100,
	startCallback = function(){};
	
	//Number of milliseconds between ticks
	self.tickRate = 10; 
	self.data = {};
	
	self.connect = function(addr){
	
		socket = io.connect(addr);
		socket.on('confirm', function (data) {
			isConnected = true;
			console.log(data);
			totalConnected = data.pool.length;
			if(desiredConnections <= totalConnected){
				self.start(0, startCallback);
			}
		});
		
		socket.on('new', function(data){
			
			remove(data.pool, socket.socket.sessionid);
			totalConnected = data.pool.length;
			if(desiredConnections <= totalConnected){
				self.start(0, startCallback);
			}
			
			console.log('new', data, totalConnected, socket.socket.sessionid);
		});		
		socket.on('gone', function(data){
			remove(data.pool, socket.socket.sessionid);
			totalConnected = data.pool.length;
			console.log('disconnected', data, totalConnected);
		});
		
		return self;
	};

	self.sync = function(){
		
		if(Math.abs(self.time.lastTime-Date.now()) > self.tickRate * 1.30){
			console.log("Skipping syncronization, possible blur. Come again soon!");
			self.time.lastTime = Date.now();
			return;
		}
		
		self.time.ticks++;
		console.log("sync", Date.now()-self.time.lastTime);
		self.time.lastTime = Date.now();
		
		//Send data back up to the server
		socket.emit('data', {tick:self.time.ticks, data:self.data});
		
		console.log(socket);
		data = dataBuffer;
	};
	
	/*
		arg1 is optional and must be desired number of connections or a callback function if it exists
		arg2 is optional and must be either the desired sync rate or a callback function if it exists
		arg3 is optional and must be a callback function if it exists
	*/
	self.start = function(arg1, arg2, arg3){
		
		//If arg1 is a number, it is the desired number of connections
		if(!isNaN(arg1)){
			desiredConnections = arg1;
		}
		
		//If arg2 is a number it is the desiredRate and arg3 if it exists must be a callback
		if(!isNaN(arg2)){
			desiredRate = arg2;
			startCallback = arg3 ? arg3 : startCallback;
		}
		
		//If arg2 exists, but is not a number, it must be a callback. There is no arg3.
		else if(arg2 && isNaN(arg2)){
			startCallback = arg2;
		}

		//A falsy (0, undefined, etc.) or functional arg1 means start immediately. This case is last to allow the other args to be used.
		//i.e: tick.start(), tick.start(callback), tick.start(false, callback), or tick.start(false, 100, callback)
		if(!arg1 || (arg1 && isNaN(arg1))){
			startCallback = arg1 ? arg1 : startCallback;
			self.every(desiredRate);
			startCallback(self);
		}
		
		console.log("Waiting for connections");
		return self;
	};
	
	self.stop = function(){
		keepLooping = false;
		window.clearTimeout(timeoutHandle);
		window.clearInterval(timeoutHandle);
	};
	
	self.every = function(rate){
		
		if(keepLooping){
			return self;
		}
		
		self.time.lastTime = Date.now();
		keepLooping = true;
		self.tickRate = rate ? rate : 100;

		/*
		(function loop(){
			timeoutHandle = setTimeout(function(){
				self.sync();
				
				if(keepLooping){
					loop();
				}
		   }, rate);
		})();
		*/
		
		//This is much more consistent than above, however, it it may timeout before function completion
		timeoutHandle = window.setInterval(self.sync, self.tickRate);
		
		return self;
	};
	
	/*
		Time object
	*/
	
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
	
	/*
		Getters and Setters
	*/
	
	self.setData = function(data){
		self.data = data;
	};
	
	self.getData = function(){
		return dataBuffer;
	};
	
	self.getNumConn = function(){
		return totalConnections;
	};
	
	self.getIdPool = function(){
		return;
	};
	
	/*
		Polyfills, fixes, and convenience functions
	*/
	
	var remove = function(arr, element){
		arr.splice(arr.indexOf(element), 1);
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