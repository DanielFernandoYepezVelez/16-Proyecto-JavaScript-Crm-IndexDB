/* Nos Permite Que Las Variables Y La Funciones Que Declaramos
En Este Archivo SE Queden De Forma Local, Es Decir, No Pueden
Salir De Este Archivo */

(function() {
    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
    });

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
})();