const fs = require('fs');

const resetReserva = (idR) => {
    const data = fs.readFileSync('./gestion-reservas/turnos.json',
        { encoding: 'utf8', flag: 'r' });
    let reservas = JSON.parse(data);
    let idReserva = idR;
    let reserva = reservas.find(x => x.idReserva == idReserva);
    let index = reservas.findIndex((i) => i.idReserva == reserva.idReserva);
    reservas[index].status = 0;
    reservas[index].email = null;
    reservas[index].userId = -1;
    let reservasJSON = JSON.stringify(reservas)
    fs.writeFile('./gestion-reservas/turnos.json', reservasJSON, (err, data) => {
        if (err) {
            return console.log(err);
        }
    })
}

module.exports = resetReserva;