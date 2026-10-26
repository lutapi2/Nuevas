(function () {
  let products = [];
  let pendingDeleteId = null;
  let selectedDetailProduct = null;
  let currentUploadedImageData = "";

  const showToast = window.CraveNotifications.showToast;
  const renderGrid = () => window.CraveCatalog.renderGrid(products);

  function getProduct(id) {
    return products.find(product => String(product.id) === String(id));
  }

  async function persistProducts(nextProducts) {
    await window.CraveDatabase.saveProducts(nextProducts);
    products = nextProducts;
    renderGrid();
  }

  window.cravePromptDelete = function(id, event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    const product = getProduct(id);
    if (!product) return;

    pendingDeleteId = id;
    document.getElementById('confirm-message').innerHTML = `¿Deseas eliminar permanentemente <strong>"${product.title}"</strong> de la colección?`;
    document.getElementById('confirm-modal').classList.remove('hidden');
  };

  window.craveOpenDetail = function(id) {
    const product = getProduct(id);
    if (!product) return;

    selectedDetailProduct = product;
    document.getElementById('detail-img').src = product.image;
    document.getElementById('detail-title').innerText = product.title;
    document.getElementById('detail-price').innerText = window.CraveCatalog.formatCOP(product.price);
    document.getElementById('detail-desc').innerText = product.desc || "Elaborado con cueros seleccionados y silueta minimalista.";
    document.getElementById('detail-modal').classList.remove('hidden');
    lucide.createIcons();
  };

  function closeDetailModal() {
    selectedDetailProduct = null;
    document.getElementById('detail-modal').classList.add('hidden');
  }

  function closeConfirmModal() {
    pendingDeleteId = null;
    document.getElementById('confirm-modal').classList.add('hidden');
  }

  async function executeDelete() {
    if (!pendingDeleteId) return;

    const idToDelete = pendingDeleteId;
    const deletedItem = getProduct(idToDelete);
    try {
      await persistProducts(products.filter(product => String(product.id) !== String(idToDelete)));
      if (selectedDetailProduct && String(selectedDetailProduct.id) === String(idToDelete)) {
        closeDetailModal();
      }
      closeConfirmModal();
      showToast(deletedItem ? `"${deletedItem.title}" eliminado` : "Calzado eliminado");
    } catch (error) {
      console.error('Error guardando la eliminación del calzado:', error);
      showToast("No se pudo guardar la eliminación. Revisa el espacio disponible.", true);
    }
  }

  function setupImageUpload() {
    const shoeFileInput = document.getElementById('shoe-file-input');
    const imagePreviewWrapper = document.getElementById('image-preview-wrapper');
    const imagePreview = document.getElementById('image-preview');

    shoeFileInput.addEventListener('change', event => {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast("Por favor selecciona un archivo de imagen válido", true);
        shoeFileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = loadEvent => {
        if (typeof loadEvent.target.result !== 'string') {
          showToast("No se pudo leer la imagen seleccionada", true);
          return;
        }
        currentUploadedImageData = loadEvent.target.result;
        imagePreview.src = currentUploadedImageData;
        imagePreviewWrapper.classList.remove('hidden');
        lucide.createIcons();
      };
      reader.onerror = () => showToast("No se pudo leer la imagen seleccionada", true);
      reader.readAsDataURL(file);
    });

    document.getElementById('btn-remove-preview').addEventListener('click', event => {
      event.preventDefault();
      currentUploadedImageData = "";
      shoeFileInput.value = "";
      imagePreviewWrapper.classList.add('hidden');
    });
  }

  function setupCreateForm() {
    const formCreateShoe = document.getElementById('form-create-shoe');
    const createModal = document.getElementById('create-modal');

    document.getElementById('btn-open-create-modal').addEventListener('click', () => {
      createModal.classList.remove('hidden');
    });
    document.getElementById('btn-close-create-modal').addEventListener('click', () => {
      createModal.classList.add('hidden');
    });

    formCreateShoe.addEventListener('submit', async event => {
      event.preventDefault();

      const title = document.getElementById('shoe-title').value.trim();
      const priceRaw = parseFloat(document.getElementById('shoe-price').value);
      const desc = document.getElementById('shoe-desc').value.trim();
      if (!title || isNaN(priceRaw) || priceRaw <= 0) {
        showToast("Ingresa un nombre y precio en pesos válido", true);
        return;
      }

      const fallbackImages = [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop"
      ];
      const newShoe = {
        id: "crave-" + Date.now(),
        title,
        price: Math.round(priceRaw),
        image: currentUploadedImageData || fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
        desc: desc || "Confección artesanal en piel noble, diseñado para combinar sobriedad y ergonomía."
      };

      try {
        await persistProducts([newShoe, ...products]);
        formCreateShoe.reset();
        currentUploadedImageData = "";
        document.getElementById('image-preview-wrapper').classList.add('hidden');
        createModal.classList.add('hidden');
        showToast(`"${newShoe.title}" agregado con éxito`);
      } catch (error) {
        console.error('Error guardando el nuevo calzado:', error);
        showToast("No se pudo guardar. La imagen podría ser demasiado grande o faltar espacio.", true);
      }
    });
  }

  window.restoreDefaultCatalog = async function() {
    try {
      await persistProducts([...window.CraveData.defaultProducts]);
      showToast("Catálogo inicial restablecido");
    } catch (error) {
      console.error('Error restaurando el catálogo:', error);
      showToast("No se pudo guardar el catálogo inicial.", true);
    }
  };

  function setupDeleteActions() {
    document.getElementById('btn-delete-from-detail').addEventListener('click', () => {
      if (selectedDetailProduct) {
        window.cravePromptDelete(selectedDetailProduct.id);
      }
    });
    document.getElementById('btn-close-detail-modal').addEventListener('click', closeDetailModal);
    document.getElementById('btn-confirm-delete').addEventListener('click', executeDelete);
    document.getElementById('btn-cancel-delete').addEventListener('click', closeConfirmModal);
    document.getElementById('btn-restore-catalog').addEventListener('click', window.restoreDefaultCatalog);
  }

  async function initializeApp() {
    window.CraveTheme.initializeTheme();
    setupImageUpload();
    setupCreateForm();
    setupDeleteActions();
    lucide.createIcons();

    try {
      products = await window.CraveDatabase.loadProducts();
      renderGrid();
    } catch (error) {
      console.error('Error cargando el catálogo:', error);
      showToast("No se pudo abrir la base de datos del catálogo.", true);
    }
  }

  window.addEventListener('DOMContentLoaded', initializeApp);
})();
