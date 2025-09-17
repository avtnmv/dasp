// Отслеживание скролла для изменения фона хедера и переключения меню
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header__top');
    const headerNav = document.querySelector('.header__nav');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const headerSection = document.querySelector('.header');
    
    if (!header || !headerNav || !mobileMenu || !headerSection) {
        console.error('Header elements not found');
        return;
    }
    
    // Проверяем, мобильное ли устройство
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = headerSection.offsetHeight;
        
        // Фон появляется при любом скролле вниз, убирается только в самом верху
        if (scrollTop > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Логика переключения меню
        if (isMobile()) {
            // На мобильных устройствах всегда показываем бургер меню
            headerNav.style.display = 'none';
            mobileMenu.style.display = 'block';
            
            // При выходе из секции header добавляем компактный режим
            if (scrollTop > headerHeight) {
                header.classList.add('compact');
            } else {
                header.classList.remove('compact');
            }
        } else {
            // На десктопе переключаем меню при выходе из секции header
            if (scrollTop > headerHeight) {
                header.classList.add('compact');
                headerNav.style.display = 'none';
                mobileMenu.style.display = 'block';
            } else {
                header.classList.remove('compact');
                headerNav.style.display = 'flex';
                mobileMenu.style.display = 'none';
            }
        }
    }
    
    // Добавляем обработчики
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Проверяем начальное состояние
    handleScroll();
});