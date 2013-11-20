var app = require('http').createServer(handler),
    io = require('socket.io').listen(app, {log:false}),
    fs = require('fs'),
	tick = require('./lib/tick.server.js');

app.listen(3001);

function handler (req, res) {
	console.log(req.url);
	

  fs.readFile(__dirname + req.url, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + req.url);
    }

    res.writeHead(200);
    res.end(data);
  });
  
}

tick.listen(io);