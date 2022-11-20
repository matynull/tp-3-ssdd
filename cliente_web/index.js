function recibeDatos(){
    var email=document.getElementById("email").value;
    var fecha=document.getElementById("fecha").value;
    var horario=document.getElementById("horario").value;
    var sucursal=document.getElementById("sucursales").value;
    var botonenv =document.getElementById("btnenv").value;

   

    console.log(email,"\n",fecha,"\n",horario,"\n",sucursal);

    botonenv.addEventListener("click",function(event){
        const res=fetch
    });
}

//POST /api/
const pedirReservas = fetch(`https://localhost:8080/api/reservas`, {
    method: "GET",
    headers:" 'Accept': 'application/json'"
}).then(res=>{
    console.log(res);
});


//DELETE /api/

//GET /api/

// GET /api/sucursales