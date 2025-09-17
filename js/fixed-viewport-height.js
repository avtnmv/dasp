// Устанавливает фиксированную высоту viewport
function setFixedVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Устанавливаем высоту только один раз при загрузке
setFixedVH();

// Опционально: обновляем только при изменении ориентации
window.addEventListener('orientationchange', () => {
    setTimeout(setFixedVH, 100);
});
