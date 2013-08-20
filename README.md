#tick.io
Tick.io is a realtime tick-based synchronization module for NodeJS built on top of socket.io.

WARNING: DO NOT USE THIS MODULE. IT IS UNDER ACTIVE DEVELOPMENT AND IS NOT READY FOR PRODUCTION OR DEVELOPMENT USE.


##Installation
####Install Node module
Use npm to install tick.io. Alternatively, you may download the script directly from [here](https://github.com/mickmuzac/tick.io/tree/master/server/lib).
```
npm install tick.io
```
Note: tick.io has only been tested with the `0.9.x` branch of socket.io.

####Listen on server
Tick.io must be included after socket.io.
```js
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app, {log:false}),
	tick = require('tick.io');

app.listen(3000);
tick.listen(io);
```

####Include client-side script
```html
<!DOCTYPE html>
<html>
<head>
	<script type="text/javascript" src="/path/to/socket.io.js"></script>
	<script type="text/javascript" src="/path/to/tick.js"></script>
</head>
<body>
</body>
</html>
```

All done!

##How to use
You can feel free to check out the [examples directory](https://github.com/mickmuzac/tick.io/tree/master/examples) for
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
####init				
The init event is fired locally only when a particular client has successfully connected to the server. 

####connect
The connect event is fired whenever a new remote connection is established. 

####incoming
The incoming event is fired when data from a remote connection is delivered to a client.

####disconnect
The disconnect event is fired whenever the connection to a remote client is lost.


##Object Properties
For the sake of clarity, `inObj` will refer to the object passed into your catch-all callback function as the second
argument. However, it is important to note that the actual name of this object is arbitrary. The following properties
are automatically accessible to your callback, although some of these properties may not always be set (see [Events](#events)).


####inObj.origin

* type: string
* description: origin is the socket ID of the remote connection which produced the event.


####inObj.pool

* type: array
* description: pool is the list of all remote socket ID's currently able to communicate with this client. 
The length of pool can be used to determine the number of other clients connected to this client.


####inObj.data
* type: arbitrary
* description: data is the information sent to this client by a another client. Data can be anything and is
not used by tick.io directly. It is up to you to determine what data is and how you will process it.

####inObj.tick

* type: number
* description: tick is a message counter that is unique per client. All messages from clients are also given
a tick number.
