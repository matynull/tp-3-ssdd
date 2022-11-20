const http = require('http');
const fs = require('fs');

const intervalo = 1;
let notificados = [];

const checkNotificaciones = () => {
    //Cargamos reservas
    const data = fs.readFileSync('./gestion-reservas/turnos.json',
                { encoding: 'utf8', flag: 'r' });
    let reservas = JSON.parse(data);
    let aNotificar = reservas.filter((reserva) => {
        // console.log(new Date());
        let dif = (new Date(reserva.datetime) - new Date())/(1000*60*60)
        return dif > 0 && dif < 24 && !notificados.includes(reserva.idReserva);
    });
    
    aNotificar.forEach((reserva) => {
        notificados.push(reserva.idReserva);
    });

    console.log(aNotificar);
}

setInterval(checkNotificaciones, intervalo*1000);

