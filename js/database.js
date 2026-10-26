(function () {
  const DATABASE_NAME = 'primera_muestra';
  const DATABASE_VERSION = 1;
  const CATALOG_STORE = 'catalog';
  let databasePromise;

  function openDatabase() {
    if (databasePromise) return databasePromise;

    databasePromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('Este navegador no permite guardar datos en IndexedDB.'));
        return;
      }

      const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(CATALOG_STORE)) {
          database.createObjectStore(CATALOG_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('No se pudo abrir la base de datos.'));
      request.onblocked = () => reject(new Error('La base de datos está bloqueada por otra pestaña.'));
    });

    databasePromise.catch(() => {
      databasePromise = null;
    });
    return databasePromise;
  }

  function readCatalog(database) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(CATALOG_STORE, 'readonly');
      const request = transaction.objectStore(CATALOG_STORE).get('products');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('No se pudo leer el catálogo.'));
      transaction.onabort = () => reject(transaction.error || new Error('Se canceló la lectura del catálogo.'));
    });
  }

  function writeCatalog(database, products) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(CATALOG_STORE, 'readwrite');
      transaction.objectStore(CATALOG_STORE).put({ key: 'products', products });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('No se pudo guardar el catálogo.'));
      transaction.onabort = () => reject(transaction.error || new Error('Se canceló el guardado del catálogo.'));
    });
  }

  async function loadProducts() {
    const database = await openDatabase();
    const record = await readCatalog(database);
    if (record) {
      if (!Array.isArray(record.products)) {
        throw new Error('Los datos guardados del catálogo no tienen un formato válido.');
      }
      return record.products;
    }

    const storedCatalog = localStorage.getItem(window.CraveData.storageKey);
    let products;
    if (storedCatalog !== null) {
      products = JSON.parse(storedCatalog);
      if (!Array.isArray(products)) {
        throw new Error('El catálogo anterior no tiene un formato válido.');
      }
    } else {
      products = window.CraveData.defaultProducts;
    }

    await writeCatalog(database, products);
    return products;
  }

  async function saveProducts(products) {
    const database = await openDatabase();
    await writeCatalog(database, products);
  }

  window.CraveDatabase = { loadProducts, saveProducts };
})();
