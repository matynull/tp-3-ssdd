let globalSucursales = {};
let globalMapUUID = "9781696f-9974-4d98-b876-05ed91e75607";

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
    pedirSucursales();

    document.getElementById("sucursales").addEventListener("change", (ev) => {
        pedirReservas(ev.target.value);
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
const pedirReservas = (sucursal) => {
    document.getElementById("reserva").innerHTML = `<option value="">Cargando...</option>`;
    fetch(`http://localhost:8080/api/reservas?branchId=${sucursal}`, 
    {
        method: "GET",
        headers: {'Accept': 'application/json'}
    }).then(res=>res.json()).then((data) => {
        console.log(data);
        let select = document.getElementById("reservas");
        let elems = "";
        markers.forEach((m) => {
            elems += `<option value="${m.id}">${m.name}</option>`;
        });
        select.innerHTML = elems;
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

const pedirSucursales = () => {
    fetch(`http://localhost:8080/api/sucursales`,
    {
        method:"GET",
        headers:{'Accept': 'application/json'}
    }).then((res) => {return res.json()}, () => {alert("Hubo un error cargando las sucursales.")}).then((data) => {
        console.log(data);
        let markers = data;
        eliminarMarcadores(() => {
            agregarMarcador(markers, 0, () => {
                console.log("Sucursales cargadas");
            })
        });
        agregarSucursalesASelect(markers);
    });
}

const agregarSucursalesASelect = (markers) => {
    let select = document.getElementById("sucursales");
    let elems = "";
    markers.forEach((m) => {
        elems += `<option value="${m.id}">${m.name}</option>`;
    });
    select.innerHTML = elems;
}

//Crear mapa
const crearMapa = () => {
    fetch(`https://cartes.io/api/maps`,
    {
        method:"POST",
        headers:{'Accept': 'application/json'},
        body:JSON.stringify({
            privacy:"public",
            users_can_create_markers:"yes"
        })
    }).then((res) => {return res.json()}, () => {alert("Hubo un error cargando las sucursales.")}).then((data) => {
        console.log(data);
    });
}

const agregarMarcador = (markers, i, callback) => {
    if(i < markers.length){
        let curMark = markers[i];
        fetch(`https://cartes.io/api/maps/${globalMapUUID}/markers?map_token=8R1hMPvRLMDA4bBZRLHzVpuZFJzfR4Fg`,
        {
            method:"POST",
            headers:{'Accept': 'application/json',
                    'Content-Type' : 'application/json'},
            body:JSON.stringify({
                "category_name": curMark.name,
                "description": "",
                "lat": curMark.lat,
                "lng": curMark.lng,
                "link": "",
                "elevation": null
            })
        }).then((res) => {return res.json()}, () => {alert("Hubo un error cargando las sucursales.")}).then((data) => {
            console.log(data);
            agregarMarcador(markers, i+1, callback);
        });
    }else{
        callback();
    }
}

const eliminarMarcadores = (callback) => {
    fetch(`https://cartes.io/api/maps/${globalMapUUID}/markers?map_token=8R1hMPvRLMDA4bBZRLHzVpuZFJzfR4Fg`,
    {
        method:"GET",
        headers:{'Accept': 'application/json',
                'Content-Type' : 'application/json'}
    }).then((res) => {return res.json()}, () => {alert("Hubo un error cargando las sucursales.")}).then((data) => {
        console.log(data);

        eliminarMarcador(data, 0, () => {
            console.log("Fuira");
            callback();
        });
    });
}

const eliminarMarcador = (markers, i, callback) => {
    if(i < markers.length){
        fetch(`https://cartes.io/api/maps/${globalMapUUID}/markers/${markers[i].id}?map_token=8R1hMPvRLMDA4bBZRLHzVpuZFJzfR4Fg`,
    {
        method:"DELETE",
        headers:{'Accept': 'application/json',
                'Content-Type' : 'application/json'}
    }).then((res) => {return res.json()}).then((data) => {
        console.log(data);
        eliminarMarcador(markers, i+1, callback);
    });
    }else{
        callback();
    }
}