const http = require('http');

const server = http.createServer(function (req, res) {
    
    console.log(req.url);

    if(req.url.startsWith("/api/sucursales")){
        let urlArr = req.url.split("/");
        console.log(urlArr);
        res.writeHead(200, { "Content-Type": "application/json" });
        if(urlArr.length >= 3){
            res.end(JSON.stringify({"id" : urlArr[2], "contenido" : "Una sola sucursal"}));
        }else{
            res.end(JSON.stringify({"contenido" : "Todas las sucursales"}));
        }
    }else{
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("No se encontro el recurso.");
    }
    
});

server.listen(8080, function() {
  console.log('Server started');
});