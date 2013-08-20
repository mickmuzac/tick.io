#tick.io
Tick.io is a realtime tick-based synchronization module for NodeJS built on top of socket.io.

WARNING: DO NOT USE THIS MODULE. IT IS UNDER ACTIVE DEVELOPMENT AND IS NOT READY FOR PRODUCTION OR DEVELOPMENT USE.


##Installation
####Install Node module
Use npm to install tick.io. Alternatively, you may download the script directly from [here](https://github.com/mickmuzac/tick.io/tree/master/server/lib).
```
npm install tick.io
```
Note: tick.io has only been tested with the `0.9.*` branch of socket.io.

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
