const http = require('http');

const solicitar = require('./solicitar.js');
//const confirmar = require('./confirmar.cjs');
//const getReservas = require('./getReservas.cjs');

const server = http.createServer(async (req, res) => {
    console.log(req.url);

    //Limpia url
    let parsedUrl = req.url.trim();
    parsedUrl = parsedUrl.replace(/^\/+|\/+$/g, "");

    if (req.url.startsWith("/api/reservas/confirmar") && req.method == 'POST') {
        confirmar(req, res);
    } else if (req.url.startsWith("/api/reservas/solicitar") && req.method == 'POST') {
        solicitar(req, res);
    } else if (req.url.startsWith("/api/reservas") && req.method == 'GET') {
        getReservas(req, res);
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("No se encontro el recurso.");
    }

});

server.listen(8080, function () {
    console.log('Server started');
});