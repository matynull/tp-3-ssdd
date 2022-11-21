const fs = require('fs');

const solicitar = function (req, res, body) {
    let parsedUrl = req.url;
    let urlArr = parsedUrl.split("/");
    if (urlArr.length == 5 && !isNaN(urlArr[4])) {
        const data = fs.readFileSync('./gestion-reservas/turnos.json',
            { encoding: 'utf8', flag: 'r' });
        let reservas = JSON.parse(data);
        let idReserva = parseInt(urlArr[4]);
        let reserva = reservas.find(x => x.idReserva == idReserva);
        
        if (!reserva) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify(`No se encontro la reserva ${idReserva}`));
        } else if (reserva.status != 0) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify(`La reserva ya tiene usuario asignado`));
        } else {
            let index = reservas.findIndex((i) => i.idReserva == reserva.idReserva);
            reserva.status = 1;
            // reserva.email = body.email;
            reserva.userId = body.userId;
            console.log("Reserva: ");
            console.log(reserva);
            reservas[index] = reserva;
            let reservasJSON = JSON.stringify(reservas)
            fs.writeFile('./gestion-reservas/turnos.json', reservasJSON, (err, data) => {
                if (err) {
                    return console.log(err);
                }
            })
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(reserva));
        }
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("No se encontro el recurso.");
    }
}

module.exports = solicitar;