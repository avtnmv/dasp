// Универсальная функция для меню
function initMenu(toggleId, burgerId, dropdownId, closeSelector) {
    const toggle = document.getElementById(toggleId);
    const burger = document.getElementById(burgerId);
    const dropdown = document.getElementById(dropdownId);
    
    if (!toggle || !burger || !dropdown) return;
    
    // Переключение меню
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        burger.classList.toggle('active');
        dropdown.classList.toggle('active');
    });
    
    // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            burger.classList.remove('active');
            dropdown.classList.remove('active');
        }
    });
    
    // Закрытие при клике на пункт меню
    const closeItems = dropdown.querySelectorAll(closeSelector);
    closeItems.forEach(item => {
        item.addEventListener('click', () => {
            burger.classList.remove('active');
            dropdown.classList.remove('active');
        });
    });
}

// Инициализация меню
document.addEventListener('DOMContentLoaded', () => {
    initMenu('projectsMenuToggle', 'hamburger', 'projectsDropdown', '.header__dropdown-item a');
    initMenu('mobileMenuToggle', 'mobileBurger', 'mobileDropdown', '.header__mobile-nav-item');
});
