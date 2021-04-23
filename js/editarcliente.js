/* Nos Permite Que Las Variables Y La Funciones Que Declaramos
En Este Archivo SE Queden De Forma Local, Es Decir, No Pueden
Salir De Este Archivo */

(function() {
    // let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        /* Actualiza Formulario */
        formulario.addEventListener('submit', actualizarCliente);

        /* Verificar El ID De La Url */
        const parametrosURL = new URLSearchParams(window.location.search);
        // console.log('Muestra Lo Que Tenemos Después De La URL', window.location.search);

        idCliente = parametrosURL.get('id');
        // console.log('Obtenemos Los Valores De La URL', idCliente);

        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    // Este Codigo Esta En Funciones.js No Vale La Pena Repetirlo
    /* function conectarDB() {
        const abrirConexion = window.indexedDB.open('CRM', 1);

        abrirConexion.onerror = function() {
            console.log('Hubo Un Error');
        }

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    }
 */
    function actualizarCliente(e) {
        e.preventDefault();

        if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos Los Registros Son Obligatorios', 'error');
            return;
        }

        /* Actualizar Cliente, Para Mandarlo A La Base De Datos */
        const clienteActualizado = {
            id: Number(idCliente),
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
        }

        const transaction = DB.transaction(['CRM'], 'readwrite');
        const objectStore = transaction.objectStore('CRM');
        objectStore.put(clienteActualizado);

        transaction.oncomplete = function() {
            imprimirAlerta('Cliente Editado Correctamente', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }

        transaction.onerror = function() {
            imprimirAlerta('Error Al Actualizar El Cliente', 'error');
        }
    }

    function obtenerCliente(id) {
        // console.log(id);
        const transaction = DB.transaction(['CRM'], 'readwrite');
        const objectStore = transaction.objectStore('CRM');

        // console.log(objectStore);
        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if (cursor) {
                // console.log(cursor.value);

                if (cursor.value['id'] === Number(id)) {
                    // console.log(cursor.value);
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        // console.log(datosCliente);
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }
})();