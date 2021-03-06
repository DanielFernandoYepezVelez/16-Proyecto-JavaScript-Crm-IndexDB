/* Nos Permite Que Las Variables Y La Funciones Que Declaramos
En Este Archivo SE Queden De Forma Local, Es Decir, No Pueden
Salir De Este Archivo */

(function() {
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if (window.indexedDB.open('CRM', 1)) {
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e) {
        // console.log(e.target);
        // console.log(e.target.classList);

        if (e.target.classList.contains('eliminar')) {
            // console.log('Click En El Boton De Eliminar');

            /* Accedo A Los Atributos Personalizados Que Se Agregaron Desde HTML5 */
            const idEliminar = Number(e.target.dataset.cliente);

            const confirmar = confirm('Estas Seguro Que Deseas Eliminar Este Cliente');

            if (confirmar) {
                const transaction = DB.transaction(['CRM'], 'readwrite');

                // Siempre Me Permite Hacer Las Transacciones
                const objectStore = transaction.objectStore('CRM');
                objectStore.delete(idEliminar);

                transaction.oncomplete = function() {
                    // console.log('Cliente Eliminado Correctamente', 'success');
                    e.target.parentElement.parentElement.remove();
                }

                transaction.onerror = function() {
                    // console.log('Cliente No Eliminando', 'error');
                }
            }
        }
    }

    /* Crear La Base De Datos De IndexDB */
    function crearDB() {
        const crearDB = window.indexedDB.open('CRM', 1);

        crearDB.onerror = function() {
            console.log('Hubo Un Error, Por Que Este Navegador No Soporta IndexDB');
        }

        crearDB.onsuccess = function() {
            DB = crearDB.result;
        }

        /* Solo Se Ejecuta Una Sola Vez, Cuando Se Crea Nuestra Base De Datos Va Ha
        Registrar Todas Las Columnas */
        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('CRM', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('id', 'id', { unique: true });
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });

            console.log('DB Lista Y Creada');
        }
    }

    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('CRM', 1);

        abrirConexion.onerror = function() {
            console.log('Tenemos Un Error En La Conexi??n Con La Base De Datos');
        }

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;

            /* Aqui Ya Tenemos El Object Store */
            const objectStore = DB.transaction('CRM').objectStore('CRM');

            objectStore.openCursor().onsuccess = function(e) {
                /* Cursor Va Almacenar Los Objetos De La DB */
                const cursor = e.target.result;

                if (cursor) {
                    // console.log(cursor.value);
                    const { nombre, empresa, email, telefono, id } = cursor.value;

                    listadoClientes.innerHTML += ` <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>`;

                    cursor.continue();
                } else {
                    console.log('No Tenemos Mas Registros En La Base De Datos.....');
                }
            }
        }
    }
})();