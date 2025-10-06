function initMenu(toggleId, burgerId, dropdownId, closeSelector) {
    const toggle = document.getElementById(toggleId);
    const burger = document.getElementById(burgerId);
    const dropdown = document.getElementById(dropdownId);
    
    if (!toggle || !burger || !dropdown) return;
    
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        burger.classList.toggle('active');
        dropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            burger.classList.remove('active');
            dropdown.classList.remove('active');
        }
    });
    
    const closeItems = dropdown.querySelectorAll(closeSelector);
    closeItems.forEach(item => {
        item.addEventListener('click', () => {
            burger.classList.remove('active');
            dropdown.classList.remove('active');
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
    
    // Функция для закрытия меню
    function closeMobileMenu() {
        if (mobileBurger && mobileDropdown) {
            mobileBurger.classList.remove('active');
            mobileDropdown.classList.remove('active');
            
            // Принудительно устанавливаем стили для закрытия
            mobileDropdown.style.opacity = '0';
            mobileDropdown.style.visibility = 'hidden';
            mobileDropdown.style.transform = 'translateX(100%)';
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
            if (mobileBurger && mobileDropdown) {
                mobileBurger.classList.remove('active');
                mobileDropdown.classList.remove('active');
            }
            
            // Переходим к форме
            if (requestForm) {
                setTimeout(() => {
                    requestForm.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        });
    });
});