function initMenu(toggleId, burgerId, dropdownId, closeSelector) {
    const toggle = document.getElementById(toggleId);
    const burger = document.getElementById(burgerId);
    const dropdown = document.getElementById(dropdownId);
    const headerContainer = document.querySelector('.header__container');
    
    if (!toggle || !burger || !dropdown) return;
    
    // Флаг для предотвращения множественных кликов
    let isAnimating = false;
    
    // Функция для управления состоянием меню
    function toggleMenuState(isActive) {
        burger.classList.toggle('active', isActive);
        dropdown.classList.toggle('active', isActive);
        if (headerContainer) {
            headerContainer.classList.toggle('active', isActive);
        }
    }
    
    // Обработчик только для гамбургера (не для всего toggle)
    burger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isAnimating) return;
        
        isAnimating = true;
        const isCurrentlyActive = burger.classList.contains('active');
        toggleMenuState(!isCurrentlyActive);
        
        // Сбрасываем флаг после завершения анимации
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    });
    
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            toggleMenuState(false);
        }
    });
    
    const closeItems = dropdown.querySelectorAll(closeSelector);
    closeItems.forEach(item => {
        item.addEventListener('click', () => {
            toggleMenuState(false);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMenu('projectsMenuToggle', 'hamburger', 'projectsDropdown', '.header__dropdown-item a');
    // Убираем автоматическое закрытие меню для мобильных ссылок, так как у нас есть специальная обработка
    initMenu('mobileMenuToggle', 'mobileBurger', 'mobileDropdown', '.header__mobile-nav-item[href^="#"]');
    
    // Универсальное закрытие мобильного меню при клике на любую ссылку
    const mobileBurger = document.getElementById('mobileBurger');
    const mobileDropdown = document.getElementById('mobileDropdown');
    
    // Флаг для предотвращения конфликтов при закрытии меню
    let isClosingMenu = false;
    
    // Функция для закрытия меню
    function closeMobileMenu() {
        if (mobileBurger && mobileDropdown && !isClosingMenu) {
            isClosingMenu = true;
            mobileBurger.classList.remove('active');
            mobileDropdown.classList.remove('active');
            
            // Убираем класс active с header__container
            const headerContainer = document.querySelector('.header__container');
            if (headerContainer) {
                headerContainer.classList.remove('active');
            }
            
            // Принудительно устанавливаем стили для закрытия
            mobileDropdown.style.opacity = '0';
            mobileDropdown.style.visibility = 'hidden';
            mobileDropdown.style.transform = 'translateX(100%)';
            
            // Убираем стили после завершения анимации
            setTimeout(() => {
                if (mobileDropdown) {
                    mobileDropdown.style.opacity = '';
                    mobileDropdown.style.visibility = '';
                    mobileDropdown.style.transform = '';
                }
                isClosingMenu = false;
            }, 300);
        }
    }
    
    // Обработчик для кнопки CTA "Залиште свій запит"
    const mobileCTA = document.querySelector('.header__mobile-cta');
    if (mobileCTA) {
        mobileCTA.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            
            setTimeout(() => {
                const targetElement = document.getElementById('request');
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        });
    }
    
    // Универсальный обработчик для всех ссылок в мобильном меню
    const mobileNavLinks = document.querySelectorAll('.header__mobile-nav-item');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log('Mobile nav link clicked:', link);
            const href = link.getAttribute('href');
            console.log('Link href:', href);
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                closeMobileMenu();
                
                setTimeout(() => {
                    const targetElement = document.getElementById(href.substring(1));
                    if (targetElement) {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    } else {
                        // Если элемент не найден на текущей странице, переходим на главную
                        console.log('Target element not found, redirecting to main page');
                        window.location.href = 'index.html' + href;
                    }
                }, 300);
            } else if (href && !href.startsWith('#')) {
                // Для внешних ссылок закрываем меню и переходим через небольшую задержку
                console.log('External link clicked:', href);
                e.preventDefault();
                closeMobileMenu();
                
                setTimeout(() => {
                    console.log('Navigating to:', href);
                    window.location.href = href;
                }, 300);
            } else {
                // Если это обычная ссылка без href или с пустым href, просто закрываем меню
                closeMobileMenu();
            }
        });
    });

    // Обработчики для всех кнопок CTA на странице
    const ctaButtons = document.querySelectorAll('.slider__cta-button, .advantages__button');
    const requestForm = document.getElementById('request');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Закрываем мобильное меню если оно открыто
            closeMobileMenu();
            
            // Переходим к форме
            if (requestForm) {
                setTimeout(() => {
                    requestForm.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            } else {
                // Если форма не найдена на текущей странице, переходим на главную
                window.location.href = 'index.html#request';
            }
        });
    });
});