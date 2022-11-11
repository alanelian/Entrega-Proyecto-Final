// Clase constructora //
class Juego {
    constructor(id, foto, name, added) {
        this.id = id;
        this.foto = foto;
        this.name = name.toUpperCase();
        this.added = added;
    }
    sumaIva() {
        this.added = this.added * 1.21;
    }
}
// Juegos creados con la clase constructora //
const juegos = [];
juegos.push(new Juego(1, "../imagenes/godofwar.png", "God Of War Standar", 4900));
juegos.push(new Juego(2, "../imagenes/fifa23.png", "Fifa 23 Standard", 23000));
juegos.push(new Juego(3, "../imagenes/gta-v.jpg", "GTA V Premium Edition", 9000));
juegos.push(new Juego(4, "../imagenes/thelastofus.jpg", "The Last of Us Remastered", 4700))
juegos.push(new Juego(5, "../imagenes/reddead2.jpg", "Red Dead Redemption 2", 7400))
juegos.push(new Juego(6, "../imagenes/residentevil2.jpg", "Resident Evil 2 Remake", 7150))
juegos.push(new Juego(7, "../imagenes/nfspayback.jpg", "Needs For Speed Payback", 5300));
juegos.push(new Juego(8, "../imagenes/ark.jpg", "Ark: Survival Evolved", 10000));
for (const juego of juegos) {
    juego.sumaIva();
}
// Carrito que puede estar vacio o tener productos guardados en el localStorage //
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let totalCarrito;
let finalizarCompra = document.getElementById("finalizar")
let contenedor = document.getElementById("misjuegos");
// Si el carrito tiene algun juego invoca la funcion renderizarTablaLocal() //
if (carrito.length != 0) {
    renderizarTablaLocal();
}
// Funcion que renderiza en la tabla los juegos guardados en el localStorage //
function renderizarTablaLocal() {
    for (const juego of carrito) {
        document.getElementById("tablabody").innerHTML += `
        <tr>
            <td>${juego.id}</td>
            <td>${juego.name}</td>
            <td>${juego.added}</td>
            <td><button class="btn btn-danger" onclick="eliminar(event)">X</button></td>
        </tr>
    `;
    }
    // Suma los precios con el metodo reduce de los juegos guardados en el localStorage //
    totalCarrito = carrito.reduce((acumulador, juego) => acumulador + juego.added, 0);
    let infoTotal = document.getElementById("total");
    infoTotal.innerText = "Total a pagar con IVA incluido $: " + totalCarrito;
}
// Funcion que renderiza los juegos //
function renderizarJuegos() {
    for (const juego of juegos) {
        contenedor.innerHTML += `
            <div class="card col-sm-3" data-aos="zoom-in">
                <img src=${juego.foto} class="card-img-top foto" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${juego.id}</h5>
                    <p class="card-text">${juego.name}</p>
                    <p class="card-text">$ ${juego.added}</p>
                    <button id="btn${juego.id}" class="btn btn-danger">Comprar</button>
                </div>
            </div>
        `;
    }
    // Por cada boton Comprar de cada card, se realiza un evento onclick que pushea el juego al carrito invocando la function agregarAlCarrito() //
    juegos.forEach(juego => {
        document.getElementById(`btn${juego.id}`).addEventListener("click", function () {
            agregarAlCarrito(juego);
        });
    })
}
// Consumo una API de juegos aplicando el metodo GET inicio //
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '3b834be1b5msh5f90676d3d0d453p187ec3jsn343d35cda773',
        'X-RapidAPI-Host': 'rawg-video-games-database.p.rapidapi.com'
    }
};

fetch('https://rawg-video-games-database.p.rapidapi.com/games?key=8739709173404e6f83bb509b12d940ed&dates=2019-09-01,2019-09-30&platforms=18,1,7', options)
    .then(response => response.json())
    .then(dataRecibida => {
        console.log(dataRecibida)
        const juegos = dataRecibida.results;
        console.log(juegos)
        // Renderizo los datos que quiero //
        for (const juego of juegos) {
            contenedor.innerHTML += `
                    <div class="card col-sm-3" data-aos="zoom-in">
                        <img src=${juego.background_image} class="card-img-top foto" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${juego.id}</h5>
                            <p class="card-text">${juego.name}</p>
                            <p class="card-text">$ ${juego.added}</p>
                            <button id="btn${juego.id}" class="btn btn-danger">Comprar</button>
                        </div>
                    </div>
                `;
        }
        renderizarJuegos();
        // Por cada boton Comprar de cada card, se realiza un evento onclick que pushea el juego al carrito invocando la function agregarAlCarrito() //
        juegos.forEach(juego => {
            document.getElementById(`btn${juego.id}`).addEventListener("click", function () {
                agregarAlCarrito(juego);
            });
        })
    })
    .catch(err => console.error(err));
// Consumo una API de juegos aplicando el metodo GET fin //
// Funcion que pushea los juegos al carrito //
function agregarAlCarrito(juegoComprado) {
    carrito.push(juegoComprado);
    Swal.fire({
        title: juegoComprado.nombre,
        text: 'Agregado al carrito',
        imageUrl: juegoComprado.foto || juegoComprado.background_image,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        background: "#dc3545",
        color: "white",
        confirmButtonColor: "white",
        customClass: {
            confirmButton: 'swalBtnColor'
        },
    })
    // Renderiza los juegos pusheados del carrito //
    document.getElementById("tablabody").innerHTML += `
        <tr>
            <td>${juegoComprado.id}</td>
            <td>${juegoComprado.name}</td>
            <td>${juegoComprado.added}</td>
            <td><button class="btn btn-danger" onclick="eliminar(event)">X</button></td>
        </tr>
    `;
    // Suma los precios de los juegos con el metodo reduce y los guarda en el localStorage //
    totalCarrito = carrito.reduce((acumulador, juego) => acumulador + juego.added, 0);
    let infoTotal = document.getElementById("total");
    infoTotal.innerText = "Total a pagar con IVA incluido $: " + totalCarrito;
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
// Evento onclick que finaliza la compra //
finalizarCompra.onclick = () => {
    // Si el carrito no tiene juegos al presionar el boton dispara una alerta de carrito vacio //
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito Vacio',
            text: '¿Que juegos queres comprar?',
            icon: 'warning',
            showConfirmButton: false,
            timer: 2000,
            background: "#dc3545",
            iconColor: "white",
            color:"white",
        })
    } else {
        // Si el carrito tiene juegos al presionar el boton elimina los juegos de la lista y dispara un Formulario //
        document.getElementById("tablabody").innerHTML = "";
        let infoTotal = document.getElementById("total");
        infoTotal.innerText = "Total a pagar con IVA incluido $: ";

        Swal.fire({
            title: 'Ingrese sus datos para recibir informacion de la compra!',
            html: `<input type="text" id="nombre" class="swal2-input" placeholder="Nombre:"> 
            <input type="text" id="apellido" class="swal2-input" placeholder="Apellido:"> 
            <input type="email" id="email" class="swal2-input" placeholder="Email:">`,
            confirmButtonText: 'Enviar',
            color:"white",
            background: "#dc3545",
            confirmButtonColor: "white",
            customClass: {
                confirmButton: 'swalBtnColor'
            },
            focusConfirm: false,
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value
                const apellido = Swal.getPopup().querySelector('#apellido').value
                const email = Swal.getPopup().querySelector('#email').value
                if (!nombre || !apellido || !email) {
                    Swal.showValidationMessage(`Ingrese sus datos porfavor`)
                }
                return { nombre: nombre, apellido: apellido, email: email }
            }
        }).then((result) => {
            // Disparo el resultado del Formulario //
            Swal.fire({
            html:`Nombre: ${result.value.nombre} <br>
                Apellido: ${result.value.apellido} <br>
                Email: ${result.value.email}
            `,
            background:"#dc3545",
            customClass: {
                confirmButton: 'swalBtnColor'
            },
            color:"white"
            .trim()})
        })
        localStorage.removeItem("carrito");
    }
}
// Funcion que busca el id de cada juego con el metodo findIndex, en la fila de la tabla, y lo elimina con el metodo splice //
function eliminar(event) {
    let fila = event.target.parentElement.parentElement;
    let id = fila.children[0].innerText;
    let indice = carrito.findIndex(juego => juego.id == id);
    carrito.splice(indice, 1)
    fila.remove();
    // Cuando se remueve el juego de la tabla, dispara un alerta //
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#dc3545",
        color: "white"
    })
    Toast.fire({
        icon: 'warning',
        title: 'Juego eliminado del carro'
    })
    // Actualiza el precio despues de eliminar un juego //
    let precioActualizado = carrito.reduce((acumulador, juego) => acumulador + juego.added, 0);
    total.innerText = "Total a pagar con IVA incluido $:" + precioActualizado;

    localStorage.setItem("carrito", JSON.stringify(carrito));
}
