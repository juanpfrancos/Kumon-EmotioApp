// Sistema de opacidad con fecha de referencia fija - Parametrizable
let opacityEnabled = true;
let referenceDate = new Date('2025-05-27T08:58:00-05:00'); // Fecha de referencia con zona horaria
let durationDays = 2; // Parametrizable
let minOpacity = 0.02; // Parametrizable
let updateInterval = 60000; // 1 minuto en ms
let intervalId = null;

// Configurar fecha de referencia
function setReferenceDate(date) {
    referenceDate = new Date(date);
    updateOpacity();
}

// Configurar duración en días
function setDurationDays(days) {
    durationDays = days;
    updateOpacity();
}

// Configurar opacidad mínima
function setMinOpacity(opacity) {
    minOpacity = Math.max(0, Math.min(1, opacity));
    updateOpacity();
}

// Activar
function enableOpacity() {
    opacityEnabled = true;
    startUpdateLoop();
}

// Desactivar
function disableOpacity() {
    opacityEnabled = false;
    document.body.style.opacity = '1';
    stopUpdateLoop();
}

// Iniciar el loop de actualización
function startUpdateLoop() {
    if (!intervalId) {
        updateOpacity();
        intervalId = setInterval(updateOpacity, updateInterval);
    }
}

// Detener el loop de actualización
function stopUpdateLoop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

// Actualizar opacidad basándose en fecha de referencia
function updateOpacity() {
    if (!opacityEnabled) {
        document.body.style.opacity = '1';
        return;
    }
    
    const now = new Date();
    const elapsed = now.getTime() - referenceDate.getTime();
    const totalDuration = durationDays * 24 * 60 * 60 * 1000; // Duración total en ms
    
    // Si aún no ha llegado la fecha de referencia
    if (elapsed < 0) {
        document.body.style.opacity = '1';
        return;
    }
    
    // Calcular progreso (0 a 1)
    const progress = Math.min(elapsed / totalDuration, 1);
    
    // Calcular opacidad (de 1 a minOpacity)
    const opacity = 1 - (progress * (1 - minOpacity));
    
    document.body.style.opacity = Math.max(opacity, minOpacity);
}

// Obtener estado actual del sistema
function getOpacityStatus() {
    const now = new Date();
    const elapsed = now.getTime() - referenceDate.getTime();
    const totalDuration = durationDays * 24 * 60 * 60 * 1000;
    const progress = Math.min(Math.max(elapsed / totalDuration, 0), 1);
    
    return {
        enabled: opacityEnabled,
        referenceDate: referenceDate.toISOString(),
        durationDays: durationDays,
        minOpacity: minOpacity,
        progress: progress,
        currentOpacity: document.body.style.opacity || '1'
    };
}

// Configuración avanzada con objeto
function configureOpacity(config = {}) {
    if (config.enabled !== undefined) opacityEnabled = config.enabled;
    if (config.referenceDate) referenceDate = new Date(config.referenceDate);
    if (config.durationDays !== undefined) durationDays = config.durationDays;
    if (config.minOpacity !== undefined) minOpacity = config.minOpacity;
    if (config.updateInterval !== undefined) updateInterval = config.updateInterval;
    
    stopUpdateLoop();
    if (opacityEnabled) {
        startUpdateLoop();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    startUpdateLoop();
});

// Limpiar al cerrar página
window.addEventListener('beforeunload', () => {
    stopUpdateLoop();
});