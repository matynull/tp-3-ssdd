let globalSucursales = {};
let globalMapUUID = "9781696f-9974-4d98-b876-05ed91e75607";
let globalMapToken = "";

document.addEventListener("DOMContentLoaded", () => {
    var botonenv =document.getElementById("btnenv");
    var botonconf =document.getElementById("btnconf");
    botonenv.addEventListener("click",function(event){
        pedirReserva();
    });
    botonconf.addEventListener("click",function(event){
        let val = validacion();
        if(val){
            confirmarReserva();
        }
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
        if (!email.value) {  
            alert("Los campos no pueden quedar vacios");
            return false;
        }
        return true;
    }

// GET /api/reservas
const pedirReservas = (sucursal) => {
    document.getElementById("reserva").innerHTML = `<option value="">Cargando...</option>`;
    fetch(`http://localhost:8080/api/reservas?branchId=${sucursal}&status=0`, 
    {
        method: "GET",
        headers: {'Accept': 'application/json'}
    }).then(res=>res.json()).then((data) => {
        console.log(data);
        let select = document.getElementById("reserva");
        let elems = "";
        data = data.sort((a, b) => {return a.datetime.localeCompare(b.datetime)});
        data.forEach((r) => {
            let d = new Date(r.datetime);
            let fecha = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth()+1).toString().padStart(2, "0")}/${d.getFullYear().toString()} a las ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
            elems += `<option value="${r.idReserva}">${fecha}</option>`;
        });
        select.innerHTML = elems;
    });
}

// alta reserva                                         //aca va el idReserva
function pedirReserva() {
    let resId = document.getElementById("reserva").value;
    fetch(`http://localhost:8080/api/reservas/solicitar/${resId}`, {
        method: "POST",
        headers: { 'Accept': 'application/json' },
        body: JSON.stringify({
            "userId": 0
        })
    }).then(res => {
        console.log(res);
        if (res.status == 200) {
            console.log("reserva exitosa");
            document.getElementById("form-solicitud").style.display = "none";
            document.getElementById("form-confirmacion").style.display = null;
        }
        else if(res.status == 406){
            console.log("error");
            alert("La reserva ya esta tomada por otro usuario.");
        }else{
            alert("No se q paso");
        }
    });
}

function confirmarReserva() {
    let resId = document.getElementById("reserva").value;
    let email = document.getElementById("email").value;
    fetch(`http://localhost:8080/api/reservas/confirmar/${resId}`, {
        method: "POST",
        headers: { 'Accept': 'application/json' },
        body: JSON.stringify({
            "userId": 0,
            "email" : email
        })
    }).then(res => {
        console.log(res);
        if (res.status == 200) {
            console.log("reserva exitosa");
            document.getElementById("form-confirmacion").style.display = "none";
            document.getElementById("pantalla-exitosa").style.display = null;
        }
        else if(res.status == 406){
            console.log("error");
            alert("La reserva ya esta tomada por otro usuario.");
        }else{
            alert("No se q paso");
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
        crearMapa(() => {
            agregarMarcador(markers, 0, () => {
                console.log("Sucursales cargadas");
            });
        })
        agregarSucursalesASelect(markers);
        if(markers.length > 0){
            pedirReservas(markers[0].id);
        }
    });
}

const pedirSucursalesOld = () => {
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
            });
        });
        agregarSucursalesASelect(markers);
        if(markers.length > 0){
            pedirReservas(markers[0].id);
        }
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
const crearMapa = (callback) => {
    fetch(`https://cartes.io/api/maps`,
    {
        method:"POST",
        headers:{'Accept': 'application/json', 'Content-Type': 'application/json'},
        body:JSON.stringify({
            privacy:"public",
            users_can_create_markers:"yes"
        })
    }).then((res) => {return res.json()}, () => {alert("Hubo un error cargando las sucursales.")}).then((data) => {
        console.log(data);
        globalMapUUID = data.uuid;
        globalMapToken = data.token;
        document.getElementById("mapas").querySelector("iframe").src = `https://app.cartes.io/maps/${globalMapUUID}/embed?type=map&lat=-37.99299224038733&lng=-57.57084846496583&zoom=13`;
        callback();
    });
}

const agregarMarcador = (markers, i, callback) => {
    if(i < markers.length){
        let curMark = markers[i];
        fetch(`https://cartes.io/api/maps/${globalMapUUID}/markers?map_token=${globalMapToken}`,
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
    fetch(`https://cartes.io/api/maps/${globalMapUUID}/markers?map_token=${globalMapToken}`,
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
        fetch(`https://cartes.io/api/maps/${globalMapUUID}/markers/${markers[i].id}?map_token=${globalMapToken}`,
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
