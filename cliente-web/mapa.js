const fetch =require("node-fetch")




// async function getData(url = '', data = {}) {
//     const response = await fetch(url, {
//       method: 'GET', 
//       mode: 'no-cors', 
//       cache: 'no-cache', 
//       credentials: 'same-origin', 
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       redirect: 'follow', 
//       referrerPolicy: 'no-referrer',
//       body: JSON.stringify(data) 
//     });
//     return response.json(); 
//   }
//   //hago la prueba con el demo map del github
//   getData('https://cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec', { answer: 42 })
//     .then((data) => {
//       console.log(data); 
//     });





fetch('https://cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec')
    .then((response) => response.json())
    .then((data) => {
        console.log('Output: ', data);
}).catch(err => console.error(err));