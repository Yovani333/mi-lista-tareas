const input = document.getElementById("tareaInput");
const lista = document.getElementById("listaTareas");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function mostrarTareas() {
  lista.innerHTML = "";

  tareas.forEach(function(tarea, index) {
    const nuevaTarea = document.createElement("li");

    const texto = document.createElement("span");
    texto.textContent = tarea;

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";

    botonEliminar.onclick = function() {
      eliminarTarea(index);
    };

    nuevaTarea.appendChild(texto);
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

  tareas.push(textoTarea);
  guardarTareas();
  mostrarTareas();

  input.value = "";
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
