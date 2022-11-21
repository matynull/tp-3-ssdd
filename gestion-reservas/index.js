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
        let date = confirmar(req, res);
        console.log(date);
        let idReserva = urlArr[3];
        let reservaConfirmada = queueReservas.find(x => x.idReserva == idReserva);
        let index = queueReservas.findIndex((i) => i.idReserva == reservaConfirmada.idReserva);
        clearTimeout(reservaConfirmada.idTimeOut);
        sendNotification(reservaConfirmada.email, date, (statusCode) => {
            console.log(statusCode);
        })
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
            queueReservas.push({ idReserva: idReserva, idTimeOut: idTimeOut, email: body.email });
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


const sendNotification = (email, datetime, callback) => {
    let d = new Date(datetime);
    console.log(d)
    let options = {
        "method": "POST",
        "host": "localhost",
        "port": "8080",
        "path": "/api/notificacion",
        "headers": {
            "Content-Type": "application/json"
        }
    };

    let data = {
        "destinatario": email,
        "asunto": "Notificación de turno",
        "cuerpo": `Reservaste un turno para el dia: ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth()+1).toString().padStart(2, "0")}/${d.getFullYear().toString()} a las ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
    }

    const request = http.request(options, function (response) {
        let body = ''
        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on('end', function () {
            callback(response.statusCode);
        });
    });
    request.write(JSON.stringify(data));
    request.end();
}




server.listen(8089, function () {
    console.log('Server started');
});