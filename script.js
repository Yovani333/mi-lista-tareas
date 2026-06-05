const input = document.getElementById("tareaInput");
const prioridadInput = document.getElementById("prioridadInput");
const fechaInput = document.getElementById("fechaInput");
const lista = document.getElementById("listaTareas");

let filtroActual = "todas";

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

tareas = tareas.map(function(tarea) {
  if (typeof tarea === "string") {
    return {
      texto: tarea,
      completada: false,
      prioridad: "baja",
      fecha: ""
    };
  }

  if (!tarea.prioridad) {
    tarea.prioridad = "baja";
  }

  if (!tarea.fecha) {
    tarea.fecha = "";
  }

  if (tarea.completada === undefined) {
    tarea.completada = false;
  }

  return tarea;
});

guardarTareas();

function mostrarTareas() {
  lista.innerHTML = "";

  const tareasOrdenadas = [...tareas].sort(function(a, b) {
    const ordenPrioridad = {
      alta: 1,
      media: 2,
      baja: 3
    };

    if (a.completada !== b.completada) {
      return a.completada - b.completada;
    }

    return ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad];
  });

  const tareasFiltradas = tareasOrdenadas.filter(function(tarea) {
    if (filtroActual === "todas") {
      return true;
    }

    if (filtroActual === "pendientes") {
      return !tarea.completada;
    }

    if (filtroActual === "completadas") {
      return tarea.completada;
    }

    return tarea.prioridad === filtroActual;
  });

  tareasFiltradas.forEach(function(tarea) {
    const index = tareas.indexOf(tarea);

    const nuevaTarea = document.createElement("li");

    nuevaTarea.classList.add("prioridad-" + tarea.prioridad);

    if (tarea.completada) {
      nuevaTarea.classList.add("tarea-completada");
    }

    const contenedorTexto = document.createElement("div");
    contenedorTexto.classList.add("tarea-info");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarea.completada;

    const texto = document.createElement("span");
    texto.textContent = tarea.texto;

    if (tarea.completada) {
      texto.classList.add("completada");
    }

    const etiquetaPrioridad = document.createElement("small");
    etiquetaPrioridad.textContent = tarea.prioridad.toUpperCase();
    etiquetaPrioridad.classList.add("etiqueta-prioridad");

    const etiquetaFecha = document.createElement("small");
    etiquetaFecha.classList.add("etiqueta-fecha");

    if (tarea.fecha) {
      etiquetaFecha.textContent = "Vence: " + formatearFecha(tarea.fecha);
    } else {
      etiquetaFecha.textContent = "Sin fecha límite";
    }

    checkbox.addEventListener("change", function() {
      tareas[index].completada = checkbox.checked;
      guardarTareas();
      mostrarTareas();
    });

    texto.addEventListener("click", function() {
      tareas[index].completada = !tareas[index].completada;
      guardarTareas();
      mostrarTareas();
    });

    const bloqueTexto = document.createElement("div");
    bloqueTexto.classList.add("bloque-texto");
    bloqueTexto.appendChild(texto);
    bloqueTexto.appendChild(etiquetaPrioridad);
    bloqueTexto.appendChild(etiquetaFecha);

    contenedorTexto.appendChild(checkbox);
    contenedorTexto.appendChild(bloqueTexto);

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";

    botonEliminar.addEventListener("click", function() {
      eliminarTarea(index);
    });

    nuevaTarea.appendChild(contenedorTexto);
    nuevaTarea.appendChild(botonEliminar);

    lista.appendChild(nuevaTarea);
  });
}

function agregarTarea() {
  const textoTarea = input.value.trim();
  const prioridad = prioridadInput.value;
  const fecha = fechaInput.value;

  if (textoTarea === "") {
    alert("Por favor escribe una tarea.");
    return;
  }

  const nuevaTarea = {
    texto: textoTarea,
    completada: false,
    prioridad: prioridad,
    fecha: fecha
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  mostrarTareas();

  input.value = "";
  prioridadInput.value = "baja";
  fechaInput.value = "";
}

function cambiarFiltro(filtro) {
  filtroActual = filtro;
  mostrarTareas();
}

function eliminarTarea(index) {
  tareas.splice(index, 1);
  guardarTareas();
  mostrarTareas();
}

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function formatearFecha(fecha) {
  const partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

mostrarTareas();
