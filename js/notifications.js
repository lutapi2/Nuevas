(function () {
  function showToast(message, isWarning = false) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');

    toastText.textContent = message;
    if (isWarning) {
      toastIcon.setAttribute('data-lucide', 'alert-circle');
      toastIcon.className = "w-4 h-4 text-amber-400";
    } else {
      toastIcon.setAttribute('data-lucide', 'check');
      toastIcon.className = "w-4 h-4 text-emerald-400";
    }
    lucide.createIcons();
    toast.classList.remove('opacity-0', 'translate-y-20');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-20');
    }, 2600);
  }

  window.CraveNotifications = { showToast };
})();
