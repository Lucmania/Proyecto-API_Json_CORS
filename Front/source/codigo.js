document.getElementById('guardarBtn').addEventListener('click', guardarUsuario);
document.getElementById('actualizarBtn').addEventListener('click', actualizarUsuario);

// Alternar modo oscuro/claro
document.getElementById('themeSwitcher').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    if (this.checked) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Mantener la elección del tema
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeSwitcher').checked = true;
}

function obtenerUsuarios() {
    axios.get('http://localhost:3000/data')
        .then(respuesta => {
            let datos = respuesta.data;
            datos.sort((a, b) => a.id - b.id);

            let table_usuario = document.getElementById("table_usuario");
            table_usuario.innerHTML = '';

            for (let registro of datos) {
                let filaTabla = document.createElement('tr');
                filaTabla.innerHTML = `
                    <td>${registro.id}</td>
                    <td>${registro.nombre}</td>
                    <td>${registro.apellido}</td>
                    <td>${registro.edad}</td>
                    <td>${registro.ciudad}</td>
                    <td>
                        <button class="consultar-btn" data-id="${registro.id}">Consultar</button>
                        <button class="modificar-btn" data-id="${registro.id}">Modificar</button>
                        <button class="eliminar-btn" data-id="${registro.id}">Eliminar</button>
                    </td>
                `;
                table_usuario.appendChild(filaTabla);
            }

            asignarEventosBotones();
        })
        .catch(error => {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al cargar los usuarios",
                text: error.message,
                showConfirmButton: true
            });
        });
}

function asignarEventosBotones() {
    document.querySelectorAll('.consultar-btn').forEach(button => {
        button.addEventListener('click', function() {
            consultarUsuario(button.getAttribute('data-id'));
        });
    });

    document.querySelectorAll('.modificar-btn').forEach(button => {
        button.addEventListener('click', function() {
            modificarUsuario(button.getAttribute('data-id'));
        });
    });

    document.querySelectorAll('.eliminar-btn').forEach(button => {
        button.addEventListener('click', function() {
            eliminarUsuario(button.getAttribute('data-id'));
        });
    });
}

function verificarIdUnico(id) {
    return axios.get(`http://localhost:3000/data/${id}`)
        .then(() => true)
        .catch(() => false);
}

async function guardarUsuario() {
    let id = parseInt(document.getElementById('id').value);
    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let edad = parseInt(document.getElementById('edad').value);
    let ciudad = document.getElementById('ciudad').value;

    if (!id || !nombre || !apellido || !edad || !ciudad) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Campos incompletos",
            text: "Por favor completa todos los campos.",
            showConfirmButton: true
        });
        return;
    }

    if (await verificarIdUnico(id)) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "ID ya existente",
            text: "El ID ingresado ya está en uso.",
            showConfirmButton: true
        });
        return;
    }

    axios.post('http://localhost:3000/data', {
        id, nombre, apellido, edad, ciudad
    })
    .then(() => {
        obtenerUsuarios();
        limpiarFormulario();
    })
    .catch(error => {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al guardar el usuario",
            text: error.message,
            showConfirmButton: true
        });
    });
}

async function actualizarUsuario() {
    let id = parseInt(document.getElementById('id').value);
    let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let edad = parseInt(document.getElementById('edad').value);
    let ciudad = document.getElementById('ciudad').value;

    if (!id || !nombre || !apellido || !edad || !ciudad) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Campos incompletos",
            text: "Por favor completa todos los campos.",
            showConfirmButton: true
        });
        return;
    }

    if (!(await verificarIdUnico(id))) {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "ID no encontrado",
            text: "El ID ingresado no existe.",
            showConfirmButton: true
        });
        return;
    }

    axios.put(`http://localhost:3000/data/${id}`, {
        nombre, apellido, edad, ciudad
    })
    .then(() => {
        obtenerUsuarios();
        limpiarFormulario();
        document.getElementById('actualizarBtn').disabled = true;
        document.getElementById('guardarBtn').disabled = false;
    })
    .catch(error => {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al actualizar el usuario",
            text: error.message,
            showConfirmButton: true
        });
    });
}

function consultarUsuario(id) {
    axios.get(`http://localhost:3000/data/${id}`)
        .then(respuesta => {
            let registro = respuesta.data;
            document.getElementById('id').value = registro.id;
            document.getElementById('nombre').value = registro.nombre;
            document.getElementById('apellido').value = registro.apellido;
            document.getElementById('edad').value = registro.edad;
            document.getElementById('ciudad').value = registro.ciudad;

            document.getElementById('id').setAttribute('readonly', 'readonly');
            document.getElementById('nombre').setAttribute('readonly', 'readonly');
            document.getElementById('apellido').setAttribute('readonly', 'readonly');
            document.getElementById('edad').setAttribute('readonly', 'readonly');
            document.getElementById('ciudad').setAttribute('disabled', 'disabled');

            document.getElementById('guardarBtn').disabled = true;
            document.getElementById('actualizarBtn').disabled = true;
        })
        .catch(error => {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al consultar el usuario",
                text: error.message,
                showConfirmButton: true
            });
        });
}

function modificarUsuario(id) {
    axios.get(`http://localhost:3000/data/${id}`)
        .then(respuesta => {
            let registro = respuesta.data;
            document.getElementById('id').value = registro.id;
            document.getElementById('nombre').value = registro.nombre;
            document.getElementById('apellido').value = registro.apellido;
            document.getElementById('edad').value = registro.edad;
            document.getElementById('ciudad').value = registro.ciudad;

            document.getElementById('id').setAttribute('readonly', 'readonly');
            document.getElementById('nombre').removeAttribute('readonly');
            document.getElementById('apellido').removeAttribute('readonly');
            document.getElementById('edad').removeAttribute('readonly');
            document.getElementById('ciudad').removeAttribute('disabled');

            document.getElementById('guardarBtn').disabled = true;
            document.getElementById('actualizarBtn').disabled = false;
        })
        .catch(error => {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error al modificar el usuario",
                text: error.message,
                showConfirmButton: true
            });
        });
}

function eliminarUsuario(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`http://localhost:3000/data/${id}`)
                .catch(error => {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Error al eliminar el usuario",
                        text: error.message,
                        showConfirmButton: true
                    });
                });
        }
    });
}

function limpiarFormulario() {
    document.getElementById('id').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('ciudad').value = '';

    document.getElementById('id').removeAttribute('readonly');
    document.getElementById('nombre').removeAttribute('readonly');
    document.getElementById('apellido').removeAttribute('readonly');
    document.getElementById('edad').removeAttribute('readonly');
    document.getElementById('ciudad').removeAttribute('disabled');
}

obtenerUsuarios();
