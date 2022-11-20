const http = require('http');
const fs = require('fs');
const url = require('url');

const solicitar = require('./solicitar.js');
const resetReserva = require('./resetReserva.js');
const confirmar = require('./confirmar.js');
//const getReservas = require('./getReservas.cjs');
const queueReservas = [];

const server = http.createServer(async (req, res) => {
    console.log(req.url);
    res.setHeader("Access-Control-Allow-Origin", "*");

    //Limpia url
    let parsedUrl = req.url.trim();
    parsedUrl = parsedUrl.replace(/^\/+|\/+$/g, "");
    let urlArr = parsedUrl.split("/");

    if (req.url.startsWith("/api/reservas/confirmar") && req.method == 'POST') {
        confirmar(req, res);
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
        if (urlArr.length == 3 && !isNaN(urlArr[2])) {
            const data = fs.readFileSync('./gestion-reservas/turnos.json',
                { encoding: 'utf8', flag: 'r' });
            let reservas = JSON.parse(data);
            let idReserva = parseInt(urlArr[2]);
            let reserva = reservas.find(x => x.idReserva == idReserva);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(reserva));
        } else {
            const data = fs.readFileSync('./gestion-reservas/turnos.json',
                { encoding: 'utf8', flag: 'r' });
            let reservas = JSON.parse(data);
            //const objParam = { userId: null, branchId: null, dateTime: null }
            queryParams = url.parse(req.url, true).query;
            let results = reservas.filter(function (entry) {
                return Object.keys(queryParams).every(function (key) {
                    return entry[key] == queryParams[key];
                });
            });
            console.log(results);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
        }

    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("No se encontro el recurso.");
    }

});

const findByMatchingProperties = (set, properties) => {
    return set.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
            return entry[key] === properties[key];
        });
    });
}
server.listen(8089, function () {
    console.log('Server started');
});