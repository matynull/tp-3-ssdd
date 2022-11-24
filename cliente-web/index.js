function recibeDatos(){
    var email=document.getElementById("email").value;
    var fecha=document.getElementById("fecha").value;
    var horario=document.getElementById("horario").value;
    var sucursal=document.getElementById("sucursales").value;


    console.log(email,"\n",fecha,"\n",horario,"\n",sucursal);

    
}

document.addEventListener("DOMContentLoaded", () => {
    var botonenv =document.getElementById("btnenv");
    botonenv.addEventListener("click",function(event){
        pedirReservas();
    });
});

//POST /api/
const pedirReservas = () => {
    fetch(`http://localhost:8089/api/reservas`, 
    {
        method: "GET",
        headers: {'Accept': 'application/json'}
    }).then(res=>{
        console.log(res);
    }).catch(res => {
        console.log(res);
    });
}


//DELETE /api/

//GET /api/

// GET /api/sucursales
