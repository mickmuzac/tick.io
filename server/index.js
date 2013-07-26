var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app, {log:false})
  , fs = require('fs')

app.listen(3000);

function handler (req, res) {
	console.log(req.url);
	

  fs.readFile(__dirname + '/../client' + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data, socket.id);
  });
});