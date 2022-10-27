// 

// const xhr = new XMLHttpRequest();

// function controldorSolicitudes(){
//     if(this.readyState===4 && this.status===200){
//     //esto hace el readystate
//         // 1 = OPENED, se ha llamado al metodo open.
//         // 2 = HEADERS_RECEIVED, se está llamando al metodo send()
//         // 3 = LOADING, está cargando, es decir, está recibiendo la respuesta.
//         // 4 = DONE, se ha completado la operación.
//         const data= JSON.parse(this.response)
//         

//        // const template=data.map((mapa)=>`<li>${mapa.title}</li>`)
//         HTMLResponse.innerHTML=`<ul>${template}</ul>`
//     }
// }

// xhr.addEventListener("load", controldorSolicitudes());
// xhr.open("GET", `https://app.cartes.io/85c495af-ca45-4d6a-ba71-c7e07df10d41?lat=-37.99070940076241&lng=-57.55572080612183&zoom=15`);
// xhr.send();

// const API_URL = "https://app.cartes.io/";
// const xhr = new XMLHttpRequest();
// function onRequestHandler() {
//   if (this.readyState===4 && this. status===200){
//      const data = JSON. parse (this. response);
//      const HTMLResponse = document. querySelector("#mapas");
//      const tpl=data.map((user)=>'<li>${user.name} </li>');
//      HTMLResponse.innerHTML= `<ul>${tpl} </ul>`;
//   }
// }

// xhr. addEventListener("load", onRequestHandler);
// xhr.open("GET",`${API_URL}/api/maps`);
// xhr.send();

// const mapa= document.querySelector("#mapas");
// const url="https://app.cartes.io/api/maps";

// fetch(url, {
//   headers: {
//     'Accept': 'application/json'
//   }})
// .url
// .then(res => console.log(res))

fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(result => result.json())
    .then((output) => {
        console.log('Output: ', output);
        
}).catch(err => console.error(err));