const fs = require('fs');

const solicitar = function (req, res) {
    let parsedUrl = req.url;
    let urlArr = parsedUrl.split("/");
    if (urlArr.length == 5 && !isNaN(urlArr[4])) {
        const data = fs.readFileSync('./gestion-reservas/turnos.json',
            { encoding: 'utf8', flag: 'r' });
        let reservas = JSON.parse(data);
        let idReserva = parseInt(urlArr[4]);
        let reserva = reservas.find(x => x.idReserva == idReserva);
        let index = reservas.findIndex((i) => i.idReserva == reserva.idReserva);
        if (!reserva) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify(`No se encontro la reserva ${idReserva}`));
        } else {
            // Queda modificar el archivo y guardarlo
            reservas[index] = 
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(reserva));
        }
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("No se encontro el recurso.");
    }
}

module.exports = solicitar;