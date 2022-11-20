const http = require('http');

const solicitar = require('./solicitar.js');
const resetReserva = require('./resetReserva.js');
const confirmar = require('./confirmar.js');
//const getReservas = require('./getReservas.cjs');
const queueReservas = [];

const server = http.createServer(async (req, res) => {
    console.log(req.url);

    //Limpia url
    let parsedUrl = req.url.trim();
    parsedUrl = parsedUrl.replace(/^\/+|\/+$/g, "");
    let urlArr = parsedUrl.split("/");

    if (req.url.startsWith("/api/reservas/confirmar") && req.method == 'POST') {
        confirmar(req,res);
        let idReserva = urlArr[3];
        let reservaConfirmada = queueReservas.find(x => x.idReserva == idReserva);
        let index = queueReservas.findIndex((i) => i.idReserva == reservaConfirmada.idReserva);
        clearTimeout(reservaConfirmada.idTimeOut);
        queueReservas.splice(index);
    } else if (req.url.startsWith("/api/reservas/solicitar") && req.method == 'POST') {
        let options = "";
        req.on('data', (chunk) => {
            options += chunk.toString();
        }).on('end', () => {
            let body = JSON.parse(options);
            solicitar(req, res, body);
            let idReserva = urlArr[3];
            let idTimeOut = setTimeout(() => {
                resetReserva(idReserva);
            }, 30000, idReserva);
            queueReservas.push({ idReserva: idReserva, idTimeOut: idTimeOut });
        })
    } else if (req.url.startsWith("/api/reservas") && req.method == 'GET') {
        getReservas(req, res);
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("No se encontro el recurso.");
    }

});



server.listen(8089, function () {
    console.log('Server started');
});