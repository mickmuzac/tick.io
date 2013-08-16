var $tickjs = new function(){
	"use strict";
	
	var self = this,
	master = false,
	socket = {},
	sessionPool = [],
	keepLooping = false,
	dataBuffer = {},
	isConnected = false,
	timeoutHandle = 0,
	totalConnected = 0,
	desiredConnections = 0,
	desiredRate = 100,
	userCallBack = function(){};
	
	//Number of milliseconds between ticks
	self.tickRate = 10; 
	self.data = {};
	
	self.connect = function(addr, cb){
	
		socket = io.connect(addr);
		userCallBack = cb ? cb : userCallBack;
		
		//This socket's connection to server is complete
		socket.on('confirm', function (data) {
			isConnected = true;
			console.log(data);
			
			remove(data.pool, socket.socket.sessionid);
			totalConnected = data.pool.length;
			if(desiredConnections <= totalConnected){
				self.start();
			}
			
			userCallBack('init', data);
		});
		
		//A socket has connected to server
		socket.on('new', function(data){
			
			remove(data.pool, socket.socket.sessionid);
			totalConnected = data.pool.length;
			if(desiredConnections <= totalConnected){
				self.start();
			}
			
			userCallBack('connect', data);
		});		
		
		//A socket has disconnected from server
		socket.on('gone', function(data){
			remove(data.pool, socket.socket.sessionid);
			totalConnected = data.pool.length;
			
			userCallBack('disconnect', data);
		});	
		
		//Recieve data from other clients via server
		socket.on('data', function(data){
			//console.log('data', data);
			remove(data.pool, socket.socket.sessionid);
			userCallBack('incoming', data);
		});
		
		//Basic latency testing
		socket.on('ping', function(data){
			socket.emit('ping', data);
		});
		
		return self;
	};

	self.sync = function(){
		
		if(Math.abs(self.time.lastTime-Date.now()) > self.tickRate * 1.30){
			console.log("Skipping syncronization, possible blur. Come again soon!");
			self.time.lastTime = Date.now();
			return;
		}
		
		userCallBack('tick');
		self.time.ticks++;
		//console.log("sync", Date.now()-self.time.lastTime);
		self.time.lastTime = Date.now();
		
		//Send data back up to the server
		socket.emit('data', {tick:self.time.ticks, client_data:self.data});
		dataBuffer = self.data;
	};
	
	/*
		arg1 is optional and must be desired number of connections if it exists
		arg2 is optional and must be either the desired sync rate if it exists
	*/
	self.start = function(arg1, arg2){
		
		//If arg1 is a number, it is the desired number of connections
		if(!isNaN(arg1)){
			desiredConnections = arg1;
		}
		
		//If arg2 is a number it is the desiredRate and arg3 if it exists must be a callback
		if(!isNaN(arg2)){
			desiredRate = arg2;
		}

		//A falsy (0, undefined, etc.) or functional arg1 means start immediately. This case is last to allow the other args to be used.
		//i.e: tick.start() or tick.start(false, 100)
		if(!arg1 || (arg1 && isNaN(arg1))){
			userCallBack('start');
			self.every(desiredRate);
			
			return self;
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
			return (temp * self.tickRate) * 0.001;
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