function agregarTarea() {
  const input = document.getElementById("tareaInput");
  const textoTarea = input.value.trim();

  if (textoTarea === "") {
    alert("Por favor escribe una tarea.");
    return;
  }

  const lista = document.getElementById("listaTareas");

  const nuevaTarea = document.createElement("li");
  nuevaTarea.textContent = textoTarea;

  const botonEliminar = document.createElement("button");
  botonEliminar.textContent = "Eliminar";

  botonEliminar.onclick = function() {
    lista.removeChild(nuevaTarea);
  };

  nuevaTarea.appendChild(botonEliminar);
  lista.appendChild(nuevaTarea);

  input.value = "";
}
