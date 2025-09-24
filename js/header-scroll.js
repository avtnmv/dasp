document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header__top');
    const headerNav = document.querySelector('.header__nav');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const headerSection = document.querySelector('.header');
    
    if (!header || !headerNav || !mobileMenu || !headerSection) {
        console.error('Header elements not found');
        return;
    }
    
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = headerSection.offsetHeight;
        
        if (scrollTop > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        if (isMobile()) {
            headerNav.style.display = 'none';
            mobileMenu.style.display = 'block';
            
            if (scrollTop > headerHeight) {
                header.classList.add('compact');
            } else {
                header.classList.remove('compact');
            }
        } else {
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
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    handleScroll();
});