//CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDzO8_rxHeumzVjQb0Ctr2Wyu7tDHkhWV8",
  authDomain: "appweb-e0930.firebaseapp.com",
  projectId: "appweb-e0930",
  storageBucket: "appweb-e0930.firebasestorage.app",
  messagingSenderId: "102665205896",
  appId: "1:102665205896:web:77bc87b5e99a904b9d873d",
  measurementId: "G-NJSK8FSVDB"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let editandoId = null;

// 🔄 Mostrar usuarios en tiempo real
function mostrarUsuarios() {
  db.collection("usuarios").onSnapshot(snapshot => {
    const contenedor = document.getElementById("usuarios");
    contenedor.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "usuario";
      div.innerHTML = `
        <strong>${data.nombre}</strong><br>
        ${data.correo}<br>
        <button onclick="editarUsuario('${doc.id}', '${data.nombre}', '${data.correo}')">✏️ Editar</button>
        <button onclick="eliminarUsuario('${doc.id}')">❌ Eliminar</button>
      `;
      contenedor.appendChild(div);
    });
  });
}

// ➕ Crear o ✏️ Actualizar
function guardarUsuario() {
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();

  if (!nombre || !correo) return alert("Completa todos los campos");

  if (editandoId) {
    db.collection("usuarios").doc(editandoId).update({ nombre, correo });
    editandoId = null;
    document.getElementById("cancelarEdicion").style.display = "none";
  } else {
    db.collection("usuarios").add({ nombre, correo });
  }

  document.getElementById("nombre").value = "";
  document.getElementById("correo").value = "";
}

// ✏️ Preparar edición
function editarUsuario(id, nombre, correo) {
  document.getElementById("nombre").value = nombre;
  document.getElementById("correo").value = correo;
  editandoId = id;
  document.getElementById("cancelarEdicion").style.display = "block";
}

// ❌ Cancelar edición
function cancelarEdicion() {
  editandoId = null;
  document.getElementById("nombre").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("cancelarEdicion").style.display = "none";
}

// 🗑️ Eliminar usuario
function eliminarUsuario(id) {
  if (confirm("¿Eliminar este usuario?")) {
    db.collection("usuarios").doc(id).delete();
  }
}

function buscarUsuarios() {
  const filtro = document.getElementById("busqueda").value.toLowerCase();
  const contenedor = document.getElementById("usuarios");

  if (!filtro) return mostrarUsuarios();

  db.collection("usuarios").get().then(snapshot => {
    contenedor.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const nombre = data.nombre.toLowerCase();
      const correo = data.correo.toLowerCase();

      if (nombre.includes(filtro) || correo.includes(filtro)) {
        const div = document.createElement("div");
        div.className = "usuario";
        div.innerHTML = `
          <strong>${data.nombre}</strong><br>
          ${data.correo}<br>
          <button onclick="editarUsuario('${doc.id}', '${data.nombre}', '${data.correo}')">✏️ Editar</button>
          <button onclick="eliminarUsuario('${doc.id}')">❌ Eliminar</button>
        `;
        contenedor.appendChild(div);
      }
    });

    if (contenedor.innerHTML === "") {
      contenedor.innerHTML = "<p>No se encontraron coincidencias.</p>";
    }
  });
}

// 🔃 Iniciar
mostrarUsuarios();
