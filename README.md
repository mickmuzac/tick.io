#tick.io
Tick.io is a realtime tick-based synchronization module for NodeJS built using socket.io.

If you are browsing using npmjs.org, please visit the [Github repo here](https://github.com/mickmuzac/tick.io). Contributions are both welcomed and encouraged!

WARNING: DO NOT USE THIS MODULE. IT IS UNDER ACTIVE DEVELOPMENT AND IS NOT READY FOR PRODUCTION OR DEVELOPMENT USE.

##Installation
####Install Node module
```
$ npm install tick.io
```
####Listen on server
Tick.io must be included after socket.io.
```js
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app, {log:false}),
	tick = require('tick.io');

/*
	Server side routing logic goes here
*/

app.listen(3000);
tick.listen(io);
```

####Include client-side script
The client side script does not need to be downloaded separately. It's included in the npm package and in all clones of this repository.

Note: Your paths will most likely be different.
```html
<!DOCTYPE html>
<html>
<head>
	<script type="text/javascript" src="/socket.io/socket.io.js"></script>
	<script type="text/javascript" src="/client/tick.client.js"></script>
</head>
<body>
</body>
</html>
```

####Start the server
```
$ node index.js
```

Navigate to `http://<server_ip>:3001/client/examples/text.html` on two different machines run text example.

All done!

##How to use
You can feel free to check out the [examples directory](https://github.com/mickmuzac/tick.io/tree/master/client/examples) for
working use-cases. 

On the client side, a bare minimum tick.io app must connect to a server and should have a catch-all callback defined.

```html
<!DOCTYPE html>
<html>
<head>
	<script type="text/javascript" src="/path/to/socket.io.js"></script>
	<script type="text/javascript" src="/path/to/tick.js"></script>
	<script type="text/javascript">
		
		var mySuperCallback = function(eventName, inObj){
		
			//Handle different events here. Both arguments are guaranteed to exist.
			//Using a switch is recommended, however, you are free to control the flow
			//of your app however you wish.
			
			//For example, using if's:
			if(eventName == "tick")
				tick.setData(Date.now());
				
			else if(eventName == "incoming")
				console.log("Data! ", inObj);
			
		};
		
		tick.connect("localhost", mySuperCallback).start();
	</script>
</head>
<body>
</body>
</html>
```

##Events
Note: In tick.io, an event is guaranteed to exist and is always a string.


####connect
* description: The connect event is fired whenever a new remote connection is established. 
* example: Client A connects, clients B and C will receive the connect event.

####disconnect
* description: The disconnect event is fired whenever the connection to a remote client is lost.
* example: Client A disconnects, clients B and C will receive the disconnect event.

####incoming
* description: The incoming event is fired when data from a remote connection is delivered to a client.
* example: Client A sends data, clients B and C will receive the incoming event.

####init				
* description: The init event is fired locally only for the client that has successfully connected to the server. 
* example: Client A connects, client A recieves the init event.

####start				
* description: The start event is fired after the desired number of remote connections (default: 0) is established. The 
start event signifies that tick.io will begin synchronization.
* example: If the desired number of connections is 3 and clients A and B are connected, then clients A, B, and C will
receive the start event after client C connects. If client D later connects, then only client D will receive the start event.

####tick
* description: The tick event is fired at specified time intervals. It enables a client to send data to remote clients at a predictable
rate.
* example: x milliseconds pass, clients A, B, and C will each receive their own respective tick events. These tick events 
are not guaranteed to fire at the same time.

##Object Properties
For the sake of clarity, `inObj` will refer to the object passed into your catch-all callback function as the second
argument. However, it is important to note that the actual name of this object is arbitrary. The following properties
are automatically accessible by your callback, although some of these properties may not always be set (see [Events](#events)).

####inObj.data
* type: arbitrary
* description: data is the information sent to this client by a remote client. Data can be anything and is
not used by tick.io directly. As the developer, it is up to you to determine what data is and how you will process it.

####inObj.origin

* type: string
* description: origin is the socket ID of the remote connection which produced the event.


####inObj.pool

* type: array
* description: pool is the list of all remote socket ID's currently able to communicate with this client. 
The length of pool can be used to determine the number of other clients connected to this client.

####inObj.tick

* type: number
* description: tick is a message counter that is unique per client. All messages from clients are also given
a tick number.
