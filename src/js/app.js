let pagina = 1;

const cita = {
    nombre: "",
    fecha: "",
    hora: "",
    servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    //resalta el div actual segun al tab que se presiona
    mostrarSeccion();
    //Oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    // Ejecutar funciones de los botones siguiente y anterior

    paginaSiguiente();

    paginaAnterior();

    //Comprueba la pagina actual ocultar o mostrar la pagina
    botonesPaginador();

    //muestra el resumen de la cita o mensaje de error
    mostrarResumen();
}
function mostrarSeccion() {
    //Remover la clase de la seccion actual
    const seccionAnterior = document.querySelector(".mostrar-seccion");
    if (seccionAnterior) {
        seccionAnterior.classList.remove("mostrar-seccion");
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add("mostrar-seccion");

    //Remuevo el tab actual de la etiqueta button
    const tabActual = document.querySelector(".tabs .actual");
    if (tabActual) {
        tabActual.classList.remove("actual");
    }

    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add("actual");
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll(".tabs button");
    enlaces.forEach((enlace) => {
        enlace.addEventListener("click", (e) => {
            e.preventDefault();
            /* console.log(e.target.dataset.paso); */

            pagina = parseInt(e.target.dataset.paso);
            /* console.log(pagina); */

            //Agrega la clase a la seccion actual
            /*  const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add("mostrar-seccion");

            //Agrego el la clase del tab actual a la etiqueta button
            const tab = document.querySelector(`[data-paso="${pagina}"]`);
            tab.classList.add("actual"); */
            botonesPaginador();

            //llamar la funcion de mostrarSeccion
            mostrarSeccion();
        });
    });
}

async function mostrarServicios() {
    try {
        const resultado = await fetch("./servicios.json");
        const db = await resultado.json();
        const { servicios } = db;

        servicios.forEach((servicio) => {
            const { id, nombre, precio } = servicio;

            /* Inicio del DOM Scripting */
            /* Generar el nombre del servicio */
            const nombreServicio = document.createElement("P");
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add("nombre-servicio");

            /* Generar el precio del Servicio */
            const precioServicio = document.createElement("P");
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add("precio-servicio");

            /* aca se genera el DIV que contiene las etiquetas P */
            const divServicio = document.createElement("DIV");
            divServicio.classList.add("servicio");
            divServicio.dataset.servicioId = id;

            /* Se genera el evento del click = EventHandler es usado cuando se crean elementos con javascript */
            divServicio.onclick = seleccionarServicio;

            // Aca se inyecta al divServicio el nombre y el precio
            divServicio.appendChild(nombreServicio);
            divServicio.appendChild(precioServicio);

            // Se inyecta el codigo al HTML
            document.querySelector("#servicios").appendChild(divServicio);
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    //Para verificar el elemento al cual damos click
    /* const id = e.target.dataset.servicioId;
    console.log(id); */
    let elemento;
    // forzar a javascript que al elemento cual le damos click se el DIV
    if (e.target.tagName === "P") {
        elemento = e.target.parentElement;
        /*  console.log(e.target.parentElement); */
    } else {
        elemento = e.target;
        /* console.log(e.target); */
    }
    /* console.log(elemento.dataset.servicioId); */

    //con esta condicional puedo averiguar si un elemento ya contiene un //clase si la tiene remover sino agregar
    if (elemento.classList.contains("seleccionado")) {
        // remuevo a clase
        elemento.classList.remove("seleccionado");

        const id = parseInt(elemento.dataset.servicioId);

        eliminarServicio(id);
    } else {
        //Agrego la clase
        elemento.classList.add("seleccionado");
        /* console.log(elemento); */
        const servicioObj = {
            id: parseInt(elemento.dataset.servicioId),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent,
        };
        /* console.log(servicioObj); */
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    /*  console.log("Eliminando...", id); */

    const { servicios } = cita;
    cita.servicios = servicios.filter((servicio) => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", () => {
        pagina++;
        console.log(pagina);
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", () => {
        pagina--;

        console.log(pagina);
        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector("#siguiente");
    const paginaAnterior = document.querySelector("#anterior");

    if (pagina === 1) {
        paginaSiguiente.classList.remove("ocultar");
        paginaAnterior.classList.add("ocultar");
    } else if (pagina === 3) {
        paginaSiguiente.classList.add("ocultar");
        paginaAnterior.classList.remove("ocultar");
    } else {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }

    mostrarSeccion(); // se invoca la seccio a mostrar desde los botones ///siguiente y anterior
}

function mostrarResumen() {
    //Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    //Seleccionar resumen

    const resumenDiv = document.querySelector(".contenido-resumen");

    //Validacion del Objeto
    if (Object.values(cita).includes("")) {
        const noServicios = document.createElement("P");
        noServicios.textContent =
            "Faltan Datos por llenar en información del Cliente ";
        noServicios.classList.add("invalidar-cita");

        //Agregar a resumenDiv
        resumenDiv.appendChild(noServicios);
    }
}
