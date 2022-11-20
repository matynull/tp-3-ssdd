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
const req= fetch(`https://localhost:1010/api`, {
    method: "POST",
    headers:" 'Accept': 'application/json'",
    body:JSON.stringify({
        "dateTime":date,//aca va fecha con hora
        "userId":0, //0
        "email":email,
        "branchId":sucursal
    })

}).then(res=>{
    if(res.status==200){

    }
    else{
        console.log("error")
    }
})


//DELETE /api/

//GET /api/

// GET /api/sucursales