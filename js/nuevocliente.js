/* Nos Permite Que Las Variables Y La Funciones Que Declaramos
En Este Archivo SE Queden De Forma Local, Es Decir, No Pueden
Salir De Este Archivo */

(function() {
    // let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });

    function validarCliente(e) {
        e.preventDefault();

        /* Leer Todos Los Inputs Del Formulario */
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos Los Datos Son Obligatorios', 'error');
            return;
        }

        /* Objeto Con La Información */
        const cliente = {
            id: Date.now(),
            nombre,
            email,
            telefono,
            empresa,
        }

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['CRM'], 'readwrite');
        const objectStore = transaction.objectStore('CRM');

        objectStore.add(cliente);

        transaction.onerror = function() {
            // console.log('Hubo Un Error Al Ingresar El Registro');
            imprimirAlerta('Hubo Un Error Al Ingresar El Registro', 'error');
        }

        transaction.oncomplete = function() {
            // console.log('Cliente Agregado Correctamente');
            imprimirAlerta('Cliente Agregado Correctamente', 'success');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }
})();