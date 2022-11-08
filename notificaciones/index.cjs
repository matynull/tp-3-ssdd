const https = require('https');
const http = require('http');
require('dotenv').config()

const server = http.createServer(async (req, res) => {
    console.log(req.url);

    //Limpia url
    let parsedUrl = req.url.trim();
    parsedUrl = parsedUrl.replace(/^\/+|\/+$/g, "");
    let options = "";

    if (req.url.startsWith("/api/notificacion") && req.method === 'POST') {
        req.on('data', (chunk) => {
            options += chunk;
        }).on('end', () => {
            sendMail(JSON.parse(options), (statusCode) => {
                res.writeHead(statusCode);
                res.end();
            });
        })
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("No se encontro el recurso.");
    }

});

server.listen(8080, function () {
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