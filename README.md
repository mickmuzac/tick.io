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
