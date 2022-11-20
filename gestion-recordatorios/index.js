const http = require('http');
const fs = require('fs');

const intervalo = 5;
let notificados = [];

const checkNotificaciones = () => {
    //Cargamos reservas
    const data = fs.readFileSync('./gestion-reservas/turnos.json',
                { encoding: 'utf8', flag: 'r' });
    let reservas = JSON.parse(data);
    let aNotificar = reservas.filter((reserva) => {
        // console.log(new Date());
        let dif = (new Date(reserva.datetime) - new Date())/(1000*60*60);
        return dif > 0 && dif < 24 && !notificados.includes(reserva.idReserva) && reserva.userId != -1 && reserva.status == 2;
    });
    
    aNotificar.forEach((reserva) => {
        sendNotification(reserva.email, reserva.datetime, (statusCode) => {
            if(statusCode.toString().startsWith("2")){
                notificados.push(reserva.idReserva);
            }else{
                console.log("Codigo de error: "+statusCode);
            }
        });
    });
}

const sendNotification = (email, datetime, callback) => {
    let d = new Date(datetime);
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
        "destinatario":email,
        "asunto":"Notificación de turno",
        "cuerpo":`Esto es un recordatorio de que tenes un turno el dia: ${d.getDay().toString().padStart(2, "0")}/${d.getMonth().toString().padStart(2, "0")}/${d.getFullYear().toString()} a las ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
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

setInterval(checkNotificaciones, intervalo*1000);

