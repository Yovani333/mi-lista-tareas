const input = document.getElementById("tareaInput");
const lista = document.getElementById("listaTareas");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// Convierte tareas antiguas de texto simple a formato nuevo
tareas = tareas.map(function(tarea) {
  if (typeof tarea === "string") {
    return {
      texto: tarea,
      completada: false
    };
  }

  return tarea;
});

guardarTareas();

function mostrarTareas() {
  lista.innerHTML = "";

  tareas.forEach(function(tarea, index) {
    const nuevaTarea = document.createElement("li");

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

    checkbox.onchange = function() {
      cambiarEstado(index);
    };

    texto.onclick = function() {
      cambiarEstado(index);
    };

    contenedorTexto.appendChild(checkbox);
    contenedorTexto.appendChild(texto);

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";

    botonEliminar.onclick = function() {
      eliminarTarea(index);
    };

    nuevaTarea.appendChild(contenedorTexto);
    nuevaTarea.appendChild(botonEliminar);
    lista.appendChild(nuevaTarea);
  });
}

function agregarTarea() {
  const textoTarea = input.value.trim();

  if (textoTarea === "") {
    alert("Por favor escribe una tarea.");
    return;
  }

  const nuevaTarea = {
    texto: textoTarea,
    completada: false
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  mostrarTareas();

  input.value = "";
}

function cambiarEstado(index) {
  tareas[index].completada = !tareas[index].completada;
  guardarTareas();
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

mostrarTareas();
