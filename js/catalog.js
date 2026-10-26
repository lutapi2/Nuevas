(function () {
  const productGrid = document.getElementById('product-grid');
  const itemsCountLabel = document.getElementById('items-count-label');

  function formatCOP(amount) {
    const num = Number(amount) || 0;
    return "$ " + new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0
    }).format(num) + " COP";
  }

  function renderGrid(products) {
    itemsCountLabel.textContent = `${products.length} ${products.length === 1 ? 'Estilo' : 'Estilos'}`;

    if (products.length === 0) {
      productGrid.innerHTML = `
        <div class="col-span-full py-20 text-center border border-dashed border-neutral-800 rounded-2xl p-8">
          <i data-lucide="package-open" class="w-10 h-10 mx-auto text-neutral-600 mb-3 stroke-[1.2]"></i>
          <h3 class="text-sm font-medium text-neutral-300 mb-1">El catálogo está vacío</h3>
          <p class="text-xs text-neutral-500 mb-5">Has eliminado todos los estilos o aún no agregas ninguno.</p>
          <div class="flex justify-center gap-3">
            <button onclick="document.getElementById('btn-open-create-modal').click()" class="px-4 py-2 bg-white text-black text-xs uppercase tracking-wider rounded font-medium hover:bg-neutral-200 transition-colors">
              + Añadir Calzado
            </button>
            <button onclick="window.restoreDefaultCatalog()" class="px-4 py-2 border border-neutral-700 text-neutral-300 text-xs uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors">
              Restaurar Ejemplos
            </button>
          </div>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    productGrid.innerHTML = products.map(product => `
      <div class="product-card group relative bg-[#18181b] dark:bg-[#18181b] rounded-2xl p-3 border border-[#27272a] dark:border-[#27272a] hover:border-neutral-500/60 transition-all duration-300 flex flex-col justify-between" data-id="${product.id}">
        <div class="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#242427] dark:bg-[#202023] relative mb-3.5 cursor-pointer" onclick="window.craveOpenDetail('${product.id}')">
          <img
            src="${product.image}"
            alt="${product.title}"
            class="w-full h-full object-cover object-center filter contrast-[1.03] group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onerror="this.onerror=null; this.src='https://placehold.co/800x600/1e1e24/a1a1aa?text=CRAVE+FOOTWEAR'"
          />
          <button
            type="button"
            onclick="window.cravePromptDelete('${product.id}', event)"
            class="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-black/75 hover:bg-red-700 text-neutral-300 hover:text-white flex items-center justify-center backdrop-blur-xs transition-colors duration-200 border border-white/10"
            title="Eliminar este calzado"
            aria-label="Eliminar calzado"
          >
            <i data-lucide="trash-2" class="w-3.5 h-3.5 pointer-events-none"></i>
          </button>
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 pointer-events-none">
            <span class="text-[11px] text-white tracking-widest uppercase bg-black/60 px-3 py-1 rounded backdrop-blur-xs">
              Ver Detalle
            </span>
          </div>
        </div>
        <div class="flex items-end justify-between px-2 pt-1 pb-2">
          <div class="cursor-pointer" onclick="window.craveOpenDetail('${product.id}')">
            <h3 class="text-sm font-normal text-white dark:text-[#ededee] tracking-normal mb-1">${product.title}</h3>
            <p class="text-xs font-mono text-[#a1a1aa] dark:text-[#a1a1aa]">${formatCOP(product.price)}</p>
          </div>
          <button
            type="button"
            onclick="window.craveOpenDetail('${product.id}')"
            class="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 dark:hover:bg-[#2a2a2f] transition-all"
            title="Ver especificaciones"
          >
            <i data-lucide="plus" class="w-4 h-4 stroke-[1.75]"></i>
          </button>
        </div>
      </div>
    `).join('');

    lucide.createIcons();
  }

  window.CraveCatalog = { formatCOP, renderGrid };
})();
