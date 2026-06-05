const input = document.getElementById("tareaInput");
const prioridadInput = document.getElementById("prioridadInput");
const fechaInput = document.getElementById("fechaInput");
const lista = document.getElementById("listaTareas");
const contadorTareas = document.getElementById("contadorTareas");

let filtroActual = "todas";
let tareaEditando = null;

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
  actualizarContador();

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

    if (tareaEditando === index) {
      mostrarFormularioEdicion(tarea, index);
    } else {
      mostrarTareaNormal(tarea, index);
    }
  });
}

function mostrarTareaNormal(tarea, index) {
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

  const contenedorBotones = document.createElement("div");
  contenedorBotones.classList.add("botones-tarea");

  const botonEditar = document.createElement("button");
  botonEditar.textContent = "Editar";
  botonEditar.classList.add("boton-editar");

  botonEditar.addEventListener("click", function() {
    tareaEditando = index;
    mostrarTareas();
  });

  const botonEliminar = document.createElement("button");
  botonEliminar.textContent = "Eliminar";

  botonEliminar.addEventListener("click", function() {
    eliminarTarea(index);
  });

  contenedorBotones.appendChild(botonEditar);
  contenedorBotones.appendChild(botonEliminar);

  nuevaTarea.appendChild(contenedorTexto);
  nuevaTarea.appendChild(contenedorBotones);

  lista.appendChild(nuevaTarea);
}

function mostrarFormularioEdicion(tarea, index) {
  const nuevaTarea = document.createElement("li");
  nuevaTarea.classList.add("modo-edicion");

  const inputEditar = document.createElement("input");
  inputEditar.type = "text";
  inputEditar.value = tarea.texto;
  inputEditar.classList.add("input-editar");

  const prioridadEditar = document.createElement("select");
  prioridadEditar.classList.add("select-editar");

  const opciones = ["baja", "media", "alta"];

  opciones.forEach(function(opcion) {
    const option = document.createElement("option");
    option.value = opcion;
    option.textContent = opcion.charAt(0).toUpperCase() + opcion.slice(1);

    if (opcion === tarea.prioridad) {
      option.selected = true;
    }

    prioridadEditar.appendChild(option);
  });

  const fechaEditar = document.createElement("input");
  fechaEditar.type = "date";
  fechaEditar.value = tarea.fecha;
  fechaEditar.classList.add("fecha-editar");

  const contenedorBotones = document.createElement("div");
  contenedorBotones.classList.add("botones-tarea");

  const botonGuardar = document.createElement("button");
  botonGuardar.textContent = "Guardar";
  botonGuardar.classList.add("boton-guardar");

  botonGuardar.addEventListener("click", function() {
    guardarEdicion(index, inputEditar.value, prioridadEditar.value, fechaEditar.value);
  });

  const botonCancelar = document.createElement("button");
  botonCancelar.textContent = "Cancelar";
  botonCancelar.classList.add("boton-cancelar");

  botonCancelar.addEventListener("click", function() {
    tareaEditando = null;
    mostrarTareas();
  });

  contenedorBotones.appendChild(botonGuardar);
  contenedorBotones.appendChild(botonCancelar);

  nuevaTarea.appendChild(inputEditar);
  nuevaTarea.appendChild(prioridadEditar);
  nuevaTarea.appendChild(fechaEditar);
  nuevaTarea.appendChild(contenedorBotones);

  lista.appendChild(nuevaTarea);

  inputEditar.focus();
}

function guardarEdicion(index, nuevoTexto, nuevaPrioridad, nuevaFecha) {
  const textoLimpio = nuevoTexto.trim();

  if (textoLimpio === "") {
    alert("La tarea no puede quedar vacía.");
    return;
  }

  tareas[index].texto = textoLimpio;
  tareas[index].prioridad = nuevaPrioridad;
  tareas[index].fecha = nuevaFecha;

  tareaEditando = null;

  guardarTareas();
  mostrarTareas();
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
  tareaEditando = null;
  actualizarBotonActivo();
  mostrarTareas();
}

function actualizarBotonActivo() {
  const botones = document.querySelectorAll(".filtros button");

  botones.forEach(function(boton) {
    boton.classList.remove("activo");
  });

  const botonActivo = document.getElementById("filtro-" + filtroActual);

  if (botonActivo) {
    botonActivo.classList.add("activo");
  }
}

function eliminarTarea(index) {
  tareas.splice(index, 1);
  tareaEditando = null;
  guardarTareas();
  mostrarTareas();
}

function borrarCompletadas() {
  const confirmar = confirm("¿Seguro que quieres borrar todas las tareas completadas?");

  if (!confirmar) {
    return;
  }

  tareas = tareas.filter(function(tarea) {
    return !tarea.completada;
  });

  tareaEditando = null;

  guardarTareas();
  mostrarTareas();
}

function actualizarContador() {
  const total = tareas.length;

  const completadas = tareas.filter(function(tarea) {
    return tarea.completada;
  }).length;

  const pendientes = total - completadas;

  contadorTareas.textContent =
    "Pendientes: " + pendientes +
    " | Completadas: " + completadas +
    " | Total: " + total;
}

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function formatearFecha(fecha) {
  const partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

actualizarBotonActivo();
mostrarTareas();
