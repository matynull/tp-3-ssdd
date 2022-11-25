const http = require('http');
const url = require('url');
require('dotenv').config();

let urlMapping = {
    "reservas" : {
        "host" : process.env.IP_RESERVAS,
        "port" : process.env.PORT_RESERVAS
    },
    "sucursales" : {
        "host" : process.env.IP_SUCURSALES,
        "port" : process.env.PORT_SUCURSALES
    }
}

const server = http.createServer(async (req, res) => {
    //Limpia url
    let parsedUrl = req.url.trim();
    parsedUrl = parsedUrl.replace(/^\/+|\/+$/g, "");
    let queryString = parsedUrl.includes("?") ? parsedUrl.split("?")[1] : "";
    let urlArr = parsedUrl.split("?")[0].split("/");

    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        if(urlArr[0] == "api"){
            if(urlMapping.hasOwnProperty(urlArr[1])){
                let pUrl = url.parse(req.url, true);
                let options = {
                    "method": req.method,
                    "host": urlMapping[urlArr[1]].host,
                    "port": urlMapping[urlArr[1]].port,
                    "path": req.url,
                    "headers": {
                        "Content-Type": "application/json"
                    }
                };

                let data = body;

                const proxyReq = http.request(options, function (proxyRes) {

                    let proxyBody = ''
                    proxyRes.on('data', function (chunk) {
                        proxyBody += chunk;
                    });
            
                    proxyRes.on('end', function () {
                        res.setHeader("Access-Control-Allow-Origin", "*");
                        res.writeHead(proxyRes.statusCode, proxyRes.headers);
                        res.write(proxyBody)
                        res.end();
                    });
            
                });
                proxyReq.write(JSON.stringify(data));
                proxyReq.end();
            }
        }else{
            res.writeHead(404, { "Content-Type": "application/json"});
            res.end("No se encontro el recurso.");
        }

    })
});

server.listen(process.env.PORT_GATEWAY, function () {
    console.log('Server started');
});