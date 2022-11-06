import { createServer } from 'http';
import { readFileSync } from 'fs';

const server = createServer(async (req, res) => {
    console.log(req.url);

    //Limpia url
    let parsedUrl = req.url.trim();
    parsedUrl = parsedUrl.replace(/^\/+|\/+$/g, "");

    const data = readFileSync('./gestion_sucursales/sucursales.json',
        { encoding: 'utf8', flag: 'r' });
    let sucursales = JSON.parse(data);
    //console.log(sucursales);

    if (req.url.startsWith("/api/sucursales") && req.method == 'GET') {
        let urlArr = parsedUrl.split("/");
        if (urlArr.length >= 3 && !isNaN(urlArr[2])) {
            let idSucursal = parseInt(urlArr[2]);
            let sucursal = sucursales.find(x => x.id == idSucursal);
            if (!sucursal) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify(`No se encontro la sucursal ${idSucursal}`));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(sucursal));
            }
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(sucursales));
        }
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("No se encontro el recurso.");
    }

});

server.listen(8080, function () {
    console.log('Server started');
});