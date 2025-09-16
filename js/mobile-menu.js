// Поп-ап меню проектов и мобильное бургер-меню
document.addEventListener('DOMContentLoaded', function() {
    const projectsMenuToggle = document.getElementById('projectsMenuToggle');
    const hamburger = document.getElementById('hamburger');
    const projectsDropdown = document.getElementById('projectsDropdown');
    
    // Мобильное бургер-меню
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileBurger = document.getElementById('mobileBurger');
    const mobileDropdown = document.getElementById('mobileDropdown');

    // Поп-ап меню проектов (десктоп)
    if (projectsMenuToggle && hamburger && projectsDropdown) {
        projectsMenuToggle.addEventListener('click', function(event) {
            event.preventDefault();
            // Переключаем классы для анимации
            hamburger.classList.toggle('active');
            projectsDropdown.classList.toggle('active');
        });

        // Закрываем меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!projectsMenuToggle.contains(event.target) && !projectsDropdown.contains(event.target)) {
                hamburger.classList.remove('active');
                projectsDropdown.classList.remove('active');
            }
        });

        // Закрываем меню при клике на пункт меню
        const dropdownItems = projectsDropdown.querySelectorAll('.header__dropdown-item a');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                projectsDropdown.classList.remove('active');
            });
        });
    }
    
    // Мобильное бургер-меню
    if (mobileMenuToggle && mobileBurger && mobileDropdown) {
        mobileMenuToggle.addEventListener('click', function(event) {
            event.preventDefault();
            // Переключаем классы для анимации
            mobileBurger.classList.toggle('active');
            mobileDropdown.classList.toggle('active');
        });

        // Закрываем мобильное меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !mobileDropdown.contains(event.target)) {
                mobileBurger.classList.remove('active');
                mobileDropdown.classList.remove('active');
            }
        });

        // Закрываем мобильное меню при клике на пункт меню
        const mobileNavItems = mobileDropdown.querySelectorAll('.header__mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileBurger.classList.remove('active');
                mobileDropdown.classList.remove('active');
            });
        });
    }
});
