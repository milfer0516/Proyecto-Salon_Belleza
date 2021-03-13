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

    //Funcion que captura el nombre del usurio en input
    nombreCita();

    // Almacenar fecha
    alamcenarFecha();

    // Deshabilitar Fechas Anteriores

    deshabilitarFechas();

    // Almacena la Hora de la Cita
    horaCita();
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

    /*  console.log(cita); */
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", () => {
        pagina++;
        /* console.log(pagina); */
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", () => {
        pagina--;

        /* console.log(pagina); */
        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector("#siguiente");
    const paginaAnterior = document.querySelector("#anterior");

    if (pagina === 1) {
        /* paginaSiguiente.classList.remove("ocultar"); */
        paginaAnterior.classList.add("ocultar");
    } else if (pagina === 3) {
        paginaSiguiente.classList.add("ocultar");
        paginaAnterior.classList.remove("ocultar");
        mostrarResumen(); //Estamos en la pagina 3 se carga todo
    } else {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }

    mostrarSeccion(); // se invoca la seccio a mostrar desde los botones ///siguiente y anterior
}

function mostrarResumen() {
    //Destructuring
    const { nombre, fecha, hora, servicios } = cita;
    /* console.log(cita); */

    //Seleccionar resumen
    const resumenDiv = document.querySelector(".contenido-resumen"); // es una manera de limpiar pero es mala /////practica
    /* console.log(Object.values(cita)); */

    //LImpia el HTML previo
    /* resumenDiv.innerHTML = ""; */
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    if (Object.values(cita).includes("")) {
        const noServicios = document.createElement("P");
        noServicios.textContent = "Faltan Datos por completar";
        noServicios.classList.add("invalidar-cita");

        // Agregar a resumenDiv
        resumenDiv.appendChild(noServicios);

        return;
    }

    const headingCitas = document.createElement("H3");
    headingCitas.textContent = "Resumen de la Cita";

    // Mostrar Resumen
    const nombreCita = document.createElement("P");
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;
    // Mostrar Fecha
    const citaFecha = document.createElement("P");
    citaFecha.innerHTML = `<span>Fecha:</span> ${fecha}`;
    // Mostrar Hora
    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    //variable global para pintar los elemtos en el HTML
    const serviciosCita = document.createElement("DIV");
    serviciosCita.classList.add("resumen-servicios");

    // Genero el texto de la cantidad en el HTMl

    //Texto de los Servicios Solicitados
    const headingServicios = document.createElement("H3");
    headingServicios.textContent = "Resumen de Servicios";

    let cantidad = 0; // esta variable se declara por fuera del forEach
    //para que itere y sume la catindad elegida

    // Iterar sobre el arreglo de los Servicios
    servicios.forEach((servicio) => {
        /* console.log(servicio); */
        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");

        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;
        /* console.log(textoServicio); */

        const textoPrecio = document.createElement("P");
        textoPrecio.textContent = precio;
        /* console.log(textoPrecio); */
        textoPrecio.classList.add("precio");

        const totalServicio = precio.split("$");

        /* console.log(parseInt(totalServicio[1].trim())); */
        cantidad += parseInt(totalServicio[1].trim());

        //Agregar el tecto de precio y nombre al contenedor
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(textoPrecio);

        serviciosCita.appendChild(contenedorServicio);
    });

    /* console.log(cantidad); */

    resumenDiv.appendChild(headingCitas);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(citaFecha);
    resumenDiv.appendChild(horaCita);
    /* console.log(nombreCita); */
    resumenDiv.appendChild(headingServicios);

    resumenDiv.appendChild(serviciosCita);

    const cantidadTotal = document.createElement("P");
    cantidadTotal.innerHTML = `<span>Total:</span> $ ${cantidad}`;
    cantidadTotal.classList.add("total");
    resumenDiv.appendChild(cantidadTotal);
}

function nombreCita() {
    const nombreInput = document.querySelector("#nombre");

    nombreInput.addEventListener("input", (e) => {
        const nombreTexto = e.target.value.trim();
        /* El método trim( ) elimina los espacios en blanco en ambos extremos del string. Los espacios en blanco en este contexto, son todos los caracteres sin contenido */
        /* console.log(nombreTexto); */

        //Validamos que los campos nombre texto no esten vacios
        if (nombreTexto === "" || nombreTexto.length <= 3) {
            mostrarAlerta("Nombre no valido", "error");
        } else {
            const alerta = document.querySelector(".alerta");
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            /* console.log(cita); */
        }
    });
}

function mostrarAlerta(mensaje, tipo) {
    //Si hay una alerta previa no crear otra
    const eliminarAlerta = document.querySelector(".alerta");
    if (eliminarAlerta) {
        return;
    }

    //Se crea la alerta el mensaje de alerta
    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");

    if (tipo === "error") {
        alerta.classList.add("error");
    } else {
        /*  console.log(alerta); */
    }
    // Mostrar la alerta en el <html>
    const formulario = document.querySelector(".formulario");
    formulario.appendChild(alerta);

    //desaparecer alerta

    setTimeout(() => {
        alerta.remove();
    }, 4000);
}

function alamcenarFecha() {
    const fechaInput = document.querySelector("#fecha");

    fechaInput.addEventListener("input", (e) => {
        const fecha = new Date(e.target.value).getUTCDay();
        /* const opciones = {
            weekday: "long",
            year: "numeric",
            month: "long",
        }; */
        /* console.log(fecha); */
        if ([0].includes(fecha)) {
            e.preventDefault();
            /* fechaInput.value = ""; */
            mostrarAlerta("Los Domingos no Trabajamos", "error");
        } else {
            cita.fecha = fechaInput.value;
            /*  console.log(cita); */
            /* console.log("Abierto"); */
        }
    });
}

function horaCita() {
    const inputHora = document.querySelector("#hora");

    inputHora.addEventListener("input", (e) => {
        const horaCita = e.target.value;
        const hora = horaCita.split(":");

        if (hora[0] < 08 || hora[0] > 20) {
            /* console.log("Horas no validas"); */
            mostrarAlerta("Hora no valida", "error");
            setTimeout(() => {
                inputHora.value = "";
            }, 2000);
        } else {
            cita.hora = horaCita;
            /* console.log("Hora valida"); */

            /* console.log(cita); */
        }
    });
}

function deshabilitarFechas() {
    const inputFecha = document.querySelector("#fecha");

    const fechaActual = new Date();

    // Formato deseado: DD/MM/AAA
    const year = fechaActual.getFullYear();
    const dia = fechaActual.getDate() + 1;
    const mes = fechaActual.getMonth() + 1;
    const fechaDeshabilitar = `${dia}-${mes}-${year}`;
    /* console.log(fechaDeshabilitar); */
    /* console.log(fechaDeshabilitar); */

    inputFecha.min = fechaDeshabilitar;
}
