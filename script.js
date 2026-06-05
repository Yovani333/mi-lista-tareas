const input = document.getElementById("tareaInput");
const prioridadInput = document.getElementById("prioridadInput");
const lista = document.getElementById("listaTareas");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

tareas = tareas.map(function(tarea) {
  if (typeof tarea === "string") {
    return {
      texto: tarea,
      completada: false,
      prioridad: "baja"
    };
  }

  if (!tarea.prioridad) {
    tarea.prioridad = "baja";
  }

  return tarea;
});

guardarTareas();

function mostrarTareas() {
  lista.innerHTML = "";

  tareas.forEach(function(tarea, index) {
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

  if (textoTarea === "") {
    alert("Por favor escribe una tarea.");
    return;
  }

  const nuevaTarea = {
    texto: textoTarea,
    completada: false,
    prioridad: prioridad
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  mostrarTareas();

  input.value = "";
  prioridadInput.value = "baja";
}

function eliminarTarea(index) {
  tareas.splice(index, 1);
  guardarTareas();
  mostrarTareas();
}

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

mostrarTareas();
