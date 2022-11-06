const http = require('http');

const request = http.request('http://localhost:8080/', { method: 'POST' }, function (response) {

  let body = ''

  response.on('data', (chunk) => {
    body += chunk;
  });

  response.on('end', () => {
    console.log('2) Received: ' + body);
  });

  response.on('close', () => {
	  console.log('3) Connection closed');
  });

});

console.log('1) Write: Hola');
request.write('Hola');

request.end();