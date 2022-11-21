const http = require('http');
const url = require('url');
require('dotenv').config()

let urlMapping = {
    "reservas" : {
        "host" : "localhost",
        "port" : 8089
    },
    "sucursales" : {
        "host" : "localhost",
        "port" : 8082
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
        body += chunk.toString();
    });

    req.on("end", () => {
        if(urlArr[0] == "api"){
            if(urlMapping.hasOwnProperty(urlArr[1])){
                let pUrl = url.parse(req.url, true);
                let options = {
                    "method": req.method,
                    "host": urlMapping[urlArr[1]].host,
                    "port": urlMapping[urlArr[1]].port,
                    "path": req.url
                };
                console.log(options);

                let data = body;

                const proxyReq = http.request(options, function (proxyRes) {

                    let proxyBody = ''
                    proxyRes.on('data', function (chunk) {
                        proxyBody += chunk;
                    });
            
                    proxyRes.on('end', function () {
                        res.writeHead(proxyRes.statusCode, proxyRes.headers);
                        res.write(proxyBody)
                        res.end();
                    });
            
                });
                proxyReq.write(JSON.stringify(data));
                proxyReq.end();
            }
        }else{
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end("No se encontro el recurso.");
        }

    })
});

server.listen(8087, function () {
    console.log('Server started');
});

// Todo esto es para mandar mail con sendgrid

let sendMail = (options,callback) => {
    let emailOptions = {
        "method": "POST",
        "host": "api.sendgrid.com",
        "path": "/v3/mail/send",
        "headers": {
            "Authorization": `${process.env.API_KEY}`,
            "Content-Type": "application/json"
        }
    };

    let data = {
        "personalizations": [
            {
                "to": [
                    {
                        "email": options.destinatario
                    }
                ],
                "subject": options.asunto
            }
        ],
        "content": [{ "type": "text/plain", "value": options.cuerpo }],
        "from": { "email": `${process.env.MAIL}`, "name": "Matias" },
        "reply_to": { "email": `${process.env.MAIL}`, "name": "Matias" }
    }

    const request = https.request(emailOptions, function (response) {

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