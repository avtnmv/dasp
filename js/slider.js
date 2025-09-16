// Слайдер проектов - идеальная синхронизация
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slider__slide');
    const navItems = document.querySelectorAll('.slider__nav-item');
    
    if (slides.length === 0 || navItems.length === 0) {
        console.log('Слайдер не найден');
        return;
    }
    
    let currentSlide = 0;
    let isAutoPlaying = true;
    let progressTimer = null;
    const slideDuration = 5000; // 5 секунд
    
    // Данные для каждого слайда
    const slideData = [
        {
            subtitle: "Продуманий комерційний простір з фокусом на результат і комфорт",
            title: "Dellicia",
            category: "Ресторан"
        },
        {
            subtitle: "Продуманий комерційний простір з фокусом на результат і комфорт",
            title: "Beter Live",
            category: "Офіс"
        },
        {
            subtitle: "Продуманий комерційний простір з фокусом на результат і комфорт",
            title: "Frau Kos",
            category: "Кондитерська"
        }
    ];

    // Функция для обновления контента слайда
    function updateSlideContent(index) {
        const subtitle = document.querySelector('.slider__subtitle');
        const title = document.querySelector('.slider__title');
        const category = document.querySelector('.slider__category');
        
        if (subtitle && title && category) {
            subtitle.textContent = slideData[index].subtitle;
            
            // Обновляем заголовок, сохраняя SVG
            const svgElement = title.querySelector('svg');
            title.innerHTML = slideData[index].title;
            if (svgElement) {
                title.appendChild(svgElement);
            }
            
            category.textContent = slideData[index].category;
        }
    }

    // Функция для показа конкретного слайда
    function showSlide(index) {
        // Убираем активный класс со всех элементов
        slides.forEach(slide => slide.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));
        
        // Добавляем активный класс к текущему слайду
        if (slides[index]) slides[index].classList.add('active');
        if (navItems[index]) navItems[index].classList.add('active');
        
        // Обновляем контент
        updateSlideContent(index);
        
        currentSlide = index;
    }

    // Функция для перехода к следующему слайду
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Функция для запуска прогресс-бара
    function startProgress() {
        // Останавливаем предыдущий прогресс
        stopProgress();
        
        const activeNavItem = document.querySelector('.slider__nav-item.active');
        const progressBar = activeNavItem ? activeNavItem.querySelector('.slider__nav-progress-bar') : null;
        
        if (!progressBar) return;
        
        // Сбрасываем прогресс-бар
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 0.1s linear';
        
        let progress = 0;
        const startTime = Date.now();
        
        progressTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            progress = (elapsed / slideDuration) * 100;
            
            if (progress >= 100) {
                progress = 100;
                progressBar.style.width = '100%';
                stopProgress();
                
                // Переключаем слайд только если автовоспроизведение включено
                if (isAutoPlaying) {
                    nextSlide();
                    // Запускаем прогресс для нового слайда
                    setTimeout(() => startProgress(), 100);
                }
            } else {
                progressBar.style.width = progress + '%';
            }
        }, 16); // ~60fps
    }

    // Функция для остановки прогресс-бара
    function stopProgress() {
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }
    }

    // Функция для запуска автовоспроизведения
    function startAutoPlay() {
        isAutoPlaying = true;
        startProgress();
    }

    // Функция для остановки автовоспроизведения
    function stopAutoPlay() {
        isAutoPlaying = false;
        stopProgress();
    }

    // Обработчики кликов для навигации
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Останавливаем автовоспроизведение
            stopAutoPlay();
            
            // Переключаем на выбранный слайд
            showSlide(index);
            
            // Возобновляем автовоспроизведение через небольшую задержку
            setTimeout(() => {
                startAutoPlay();
            }, 100);
        });
    });

    // Убрана заморозка при наведении мыши

    // Инициализация
    showSlide(0);
    startAutoPlay();
    
    console.log('Слайдер инициализирован успешно');
});