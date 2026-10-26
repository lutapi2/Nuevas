(function () {
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.className = "bg-[#131315] text-[#d4d4d8] dark:bg-[#131315] dark:text-[#d4d4d8] min-h-screen flex flex-col antialiased selection:bg-neutral-700 selection:text-white";
      themeIcon.setAttribute('data-lucide', 'sun');
      localStorage.setItem('crave_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = "bg-[#f5f4f0] text-[#1c1c1f] min-h-screen flex flex-col antialiased selection:bg-neutral-300 selection:text-black";
      themeIcon.setAttribute('data-lucide', 'moon');
      localStorage.setItem('crave_theme', 'light');
    }
    lucide.createIcons();
  }

  function initializeTheme() {
    applyTheme(localStorage.getItem('crave_theme') !== 'light');
    document.getElementById('theme-toggle').addEventListener('click', () => {
      applyTheme(!document.documentElement.classList.contains('dark'));
    });
  }

  window.CraveTheme = { initializeTheme };
})();
