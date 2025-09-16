// =============================================================================
// PRELOADER - ждет загрузки всех ресурсов перед показом сайта
// =============================================================================

(function() {
    'use strict';

    // Элементы
    const preloader = document.getElementById('preloader');
    const body = document.body;
    
    // Счетчик загруженных ресурсов
    let loadedResources = 0;
    const totalResources = 3; // CSS + 3 изображения
    
    // Функция для проверки загрузки CSS
    function checkCSSLoaded() {
        return new Promise((resolve) => {
            // Проверяем, что CSS загружен
            const testElement = document.createElement('div');
            testElement.className = 'slider__slide';
            testElement.style.display = 'none';
            document.body.appendChild(testElement);
            
            // Проверяем, что стили применились
            const computedStyle = window.getComputedStyle(testElement);
            const hasStyles = computedStyle.position === 'absolute';
            
            document.body.removeChild(testElement);
            
            if (hasStyles) {
                resolve();
            } else {
                // Если стили еще не загружены, ждем
                setTimeout(() => checkCSSLoaded().then(resolve), 100);
            }
        });
    }
    
    // Функция для предзагрузки изображений
    function preloadImages() {
        const images = [
            './img/header-slider-1.webp',
            './img/header-slider-2.webp',
            './img/header-slider-3.webp'
        ];
        
        const promises = images.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve; // Продолжаем даже если изображение не загрузилось
                img.src = src;
            });
        });
        
        return Promise.all(promises);
    }
    
    // Функция для скрытия preloader
    function hidePreloader() {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
                body.classList.remove('preloader-active');
            }, 500);
        }
    }
    
    // Функция для показа preloader
    function showPreloader() {
        body.classList.add('preloader-active');
    }
    
    // Инициализация
    function init() {
        showPreloader();
        
        // Ждем загрузки всех ресурсов
        Promise.all([
            checkCSSLoaded(),
            preloadImages()
        ]).then(() => {
            // Небольшая задержка для плавности
            setTimeout(hidePreloader, 300);
        });
    }
    
    // Запускаем при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
