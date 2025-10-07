document.addEventListener('DOMContentLoaded', function() {
    // Простой Swiper для галереи проектов
    const swiperContainer = document.getElementById('example-gallery-swiper');
    
    if (!swiperContainer) {
        return;
    }

    // Уничтожаем существующий Swiper если есть
    if (swiperContainer.swiper) {
        swiperContainer.swiper.destroy(true, true);
    }

    // Функция обновления кнопок
    function updateButtons(swiperInstance) {
        const prevBtn = document.getElementById('gallery-prev');
        const nextBtn = document.getElementById('gallery-next');
        
        if (prevBtn && nextBtn && swiperInstance) {
            prevBtn.disabled = swiperInstance.isBeginning;
            nextBtn.disabled = swiperInstance.isEnd;
        }
    }

    // Функция для определения количества слайдов
    function getSlidesCount() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        if (isMobile || isTablet) {
            return 6; // Мобильные слайды (по одному изображению)
        } else {
            return 3; // Десктопные слайды (по два изображения)
        }
    }

    // Ждем немного для избежания конфликтов
    setTimeout(() => {
        try {
            const exampleSwiper = new Swiper('#example-gallery-swiper', {
                // Основные настройки
                slidesPerView: 1,
                spaceBetween: 20,
                loop: false, // Отключаем loop
                speed: 520,
                allowTouchMove: true,
                
                // Отключаем автопрокрутку
                autoplay: false,
                
                // Навигация
                navigation: {
                    nextEl: '#gallery-next',
                    prevEl: '#gallery-prev',
                },
                
                // Отключаем пагинацию
                pagination: false,
                
                // Минимальные настройки для стабильности
                watchSlidesProgress: false,
                watchSlidesVisibility: false,
                preventInteractionOnTransition: false,
                allowSlideNext: true,
                allowSlidePrev: true,
                
                // Обработчики событий
                on: {
                    init: function() {
                        console.log('Example Swiper initialized');
                        updateButtons(this);
                    },
                    slideChange: function() {
                        updateButtons(this);
                    }
                }
            });

            // Обработчик изменения размера окна
            window.addEventListener('resize', function() {
                setTimeout(() => {
                    if (exampleSwiper) {
                        exampleSwiper.update();
                        updateButtons(exampleSwiper);
                    }
                }, 100);
            });
            
        } catch (error) {
            console.error('Error initializing example Swiper:', error);
        }
    }, 200);
});