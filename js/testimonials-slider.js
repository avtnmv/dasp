// Testimonials Swiper - Independent Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on about page
    const swiperElement = document.querySelector('.about-testimonials-swiper');
    if (!swiperElement) {
        return;
    }

    // Destroy any existing swiper instances on this element
    if (swiperElement.swiper) {
        swiperElement.swiper.destroy(true, true);
    }

    // Initialize fresh Swiper instance
    const testimonialsSwiper = new Swiper('.about-testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        speed: 600,
        allowTouchMove: true,
        grabCursor: true,
        watchSlidesProgress: true,
        navigation: {
            nextEl: '.testimonials__nav-btn--next',
            prevEl: '.testimonials__nav-btn--prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1200: {
                slidesPerView: 2,
                spaceBetween: 24,
            }
        },
        on: {
            init: function() {
                console.log('About Testimonials Swiper initialized');
                console.log('Slides per view:', this.params.slidesPerView);
            },
            resize: function() {
                console.log('Swiper resized, slides per view:', this.params.slidesPerView);
            }
        }
    });

    // Read More Functionality
    function initReadMore() {
        const readMoreBtns = document.querySelectorAll('.testimonials__read-more-btn');
        
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.testimonials__card');
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    // Collapse
                    card.classList.remove('expanded');
                } else {
                    // Expand
                    card.classList.add('expanded');
                }
                
                // Update Swiper after animation completes
                setTimeout(() => {
                    if (testimonialsSwiper) {
                        testimonialsSwiper.update();
                    }
                }, 500); // Задержка соответствует длительности CSS анимации
            });
        });
    }
    
    // Initialize read more functionality
    initReadMore();
});
