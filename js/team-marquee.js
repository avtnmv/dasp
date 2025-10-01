document.addEventListener('DOMContentLoaded', function() {
    const marqueeContainer = document.querySelector('.our-team__marquee-content');
    const photoContainer = document.querySelector('.our-team__photo-container');
    const photoImg = document.querySelector('.our-team__photo');
    if (!marqueeContainer || !photoContainer || !photoImg) return;

    // Проверяем, является ли устройство мобильным или планшетом
    const isMobileOrTablet = window.innerWidth <= 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let marqueeTween;
    let hoveredItem = null;

    // Вычисляем ширину одного набора элементов
    const firstSet = marqueeContainer.children.length / 3;
    let setWidth = 0;
    
    for (let i = 0; i < firstSet; i++) {
        const item = marqueeContainer.children[i];
        setWidth += item.offsetWidth + 20; // 20px gap
    }

    // Создаем бесконечную анимацию с GSAP
    function createMarqueeAnimation() {
        const animationConfig = {
            x: -setWidth,
            duration: setWidth / 220, // Скорость анимации
            ease: "none",
            repeat: -1
        };

        // Добавляем onUpdate только для десктопа
        if (!isMobileOrTablet) {
            animationConfig.onUpdate = function() {
                // Обновляем позицию фото если оно активно
                if (hoveredItem && photoContainer.classList.contains('active')) {
                    updatePhotoPosition();
                }
            };
        }

        marqueeTween = gsap.to(marqueeContainer, animationConfig);
    }

    // Функция для обновления позиции фото
    function updatePhotoPosition() {
        if (hoveredItem && photoContainer.classList.contains('active')) {
            const rect = hoveredItem.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            photoContainer.style.left = centerX + 'px';
            photoContainer.style.top = centerY + 'px';
            photoContainer.style.transform = 'translate(-50%, -50%)';
        }
    }

    // Обработчики для каждого элемента команды (только для десктопа)
    if (!isMobileOrTablet) {
        const teamItems = marqueeContainer.querySelectorAll('.our-team__item');
        teamItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const photoSrc = this.getAttribute('data-photo');
                if (photoSrc) {
                    hoveredItem = this;
                    photoImg.src = photoSrc;
                    photoContainer.classList.add('active');
                    
                    // Останавливаем marquee
                    if (marqueeTween) {
                        marqueeTween.pause();
                    }
                    
                    // Позиционируем фото
                    updatePhotoPosition();
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (hoveredItem === this) {
                    hoveredItem = null;
                    photoContainer.classList.remove('active');
                    
                    // Возобновляем marquee
                    if (marqueeTween) {
                        marqueeTween.resume();
                    }
                }
            });
        });
    }

    // Общий обработчик для marquee контейнера (только для десктопа)
    if (!isMobileOrTablet) {
        marqueeContainer.addEventListener('mouseleave', function() {
            hoveredItem = null;
            photoContainer.classList.remove('active');
            
            // Возобновляем marquee при уходе с контейнера
            if (marqueeTween) {
                marqueeTween.resume();
            }
        });
    }

    // Запускаем анимацию
    createMarqueeAnimation();

    // Очистка при размонтировании
    window.addEventListener('beforeunload', function() {
        if (marqueeTween) {
            marqueeTween.kill();
        }
    });
});