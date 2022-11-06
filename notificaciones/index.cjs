
const http = require('https');
require('dotenv').config()

let options ={
    "method":"POST",
    "host":"api.sendgrid.com",
    "path":"/v3/mail/send",
    "headers":{
        "Authorization":`${process.env.API_KEY}`,
        "Content-Type": "application/json"
    }
};

let data = {
    "personalizations":[
        {
            "to":[
                {
                    "email":"lucagutierrez@hotmail.com",
                    "name":"Pelusa Gutierrez"
                }
            ],
            "subject":"Hello world"
        }
    ],
    "content": [{"type": "text/plain", "value": "Heya!"}],
    "from":{"email":`${process.env.MAIL}`,"name":"Matias"},
    "reply_to":{"email":`${process.env.MAIL}`,"name":"Matias"}
}

const request = http.request(options, function (response) {

  let body = ''
  response.on('data',function(chunk){
    body+=chunk;
  });

  response.on('end',function(){
    console.log(body);
  });


});
request.write(JSON.stringify(data));
request.end();