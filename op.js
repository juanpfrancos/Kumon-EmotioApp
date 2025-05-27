// Sistema simple de opacidad - Control desde código
let opacityEnabled = true;
let startTime = null;

// Cargar configuración
function loadOpacity() {
    const saved = localStorage.getItem('opacityData');
    if (saved) {
        const data = JSON.parse(saved);
        opacityEnabled = data.enabled;
        startTime = data.startTime;
    }
}

// Guardar configuración
function saveOpacity() {
    localStorage.setItem('opacityData', JSON.stringify({
        enabled: opacityEnabled,
        startTime: startTime
    }));
}

// Activar
function enableOpacity() {
    opacityEnabled = true;
    startTime = Date.now();
    saveOpacity();
}

// Desactivar
function disableOpacity() {
    opacityEnabled = false;
    startTime = null;
    document.body.style.opacity = '1';
    saveOpacity();
}

// Actualizar opacidad
function updateOpacity() {
    if (!opacityEnabled || !startTime) return;
    
    const elapsed = Date.now() - startTime;
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const progress = Math.min(elapsed / threeDays, 1);
    const opacity = 1 - (progress * 0.98);
    
    document.body.style.opacity = Math.max(opacity, 0.02);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadOpacity();
    updateOpacity();
    setInterval(updateOpacity, 60000);
});