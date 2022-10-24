const http = require('http');

const server = http.createServer(function (req, res) {
    
    console.log(req.url);
    res.end('Mundo');
});

server.listen(8080, function() {
  console.log('Server started');
});