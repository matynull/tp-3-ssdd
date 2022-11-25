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
        validacion();
        pedirReservas();
        
    });
});

//valido espacios vacios

function validaVacio(valor) {
    valor = valor.replace("&nbsp;", "");
    valor = valor == undefined ? "" : valor;
    if (!valor || 0 === valor.trim().length) {
        return true;
        }
    else {
        return false;
        }
    }

    function validacion(){
        // var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        // if ( !expr.test(email)){                                                            
        //     alert("Error: La dirección de email " + email + " es incorrecta.");
        //     return false;
        // }
        if (validaVacio(email.value)) {  
            alert("Los campos no pueden quedar vacios");
            return false;
        }
        return true;
    }

// GET /api/reservas
const pedirReservas = () => {
    fetch(`http://localhost:8089/api/reservas`, 
    {
        method: "GET",
        headers: {'Accept': 'application/json'}
    }).then(res=>res.json()

    ).then.array.forEach(element => {
        let idReserva=element.idReserva;
        let userId=element.userId;

    }).catch(res => {
        console.log(res);
    });
}

// alta reserva                                         //aca va el idReserva
function pedirReserva() {
    fetch(`https://localhost:8080/api/reservas/confirmar/ `, {
        method: "POST",
        headers: { 'Accept': 'application/json' },
        body: JSON.stringify({
            "userId": 0,
            "email": email,
        })
    }).then(res => {
        if (res.status == 200) {
            console.log("reserva exitosa");
        }
        else {
            console.log("error");
        }
    });
}


//DELETE /api/




//GET /api/

// GET /api/sucursales

const pedirSucursales=()=>{
    fetch(`http://localhost:8089/api/reservas`,
    {
        method:"GET",
        headers:{'Accept': 'application/json'},
        body:"" // lat y lng
    });
}