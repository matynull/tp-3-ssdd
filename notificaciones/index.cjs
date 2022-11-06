
const http = require('https');

let options ={
    "method":"POST",
    "host":"api.sendgrid.com",
    "path":"/v3/mail/send",
    "headers":{
        "Authorization":"Bearer SG.Og68H4KTR92Cgeyq4Q3_2g.DeLwrkez4EDX_Pk42UQ0KXzPtffQe32-XRzRPldBQXQ",
        "Content-Type": "application/json"
    }
};
//'{"personalizations":[{"to":[{"email":"john.doe@example.com","name":"John Doe"}],"subject":"Hello, World!"}],"content": [{"type": "text/plain", "value": "Heya!"}],"from":{"email":"sam.smith@example.com","name":"Sam Smith"},"reply_to":{"email":"sam.smith@example.com","name":"Sam Smith"}}'

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
    "from":{"email":"matiasalmeida546@gmail.com","name":"Matias"},
    "reply_to":{"email":"matiasalmeida546@gmail.com","name":"Matias"}
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
