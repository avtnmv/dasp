document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slider__slide');
    const navItems = document.querySelectorAll('.slider__nav-item');
    
    
    let currentSlide = 0;
    let isAutoPlaying = true;
    let progressTimer = null;
    const slideDuration = 5000;
    
    const slideData = [
        { title: "Dellicia", category: "Ресторан" },
        { title: "Beter Live", category: "Офіс" },
        { title: "Frau Kos", category: "Кондитерська" }
    ];
    
    const commonSubtitle = "Продуманий комерційний простір з фокусом на результат і комфорт";

    function updateSlideContent(index) {
        const subtitle = document.querySelector('.slider__subtitle');
        const title = document.querySelector('.slider__title');
        const category = document.querySelector('.slider__category');
        
        if (subtitle && title && category) {
            subtitle.textContent = commonSubtitle;
            
            const svgElement = title.querySelector('svg');
            title.innerHTML = slideData[index].title;
            if (svgElement) {
                title.appendChild(svgElement);
            }
            
            category.textContent = slideData[index].category;
        }
    }

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));
        
        if (slides[index]) slides[index].classList.add('active');
        if (navItems[index]) navItems[index].classList.add('active');
        
        updateSlideContent(index);
        
        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function startProgress() {
        stopProgress();
        
        const activeNavItem = document.querySelector('.slider__nav-item.active');
        const progressBar = activeNavItem ? activeNavItem.querySelector('.slider__nav-progress-bar') : null;
        
        if (!progressBar) return;
        
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
                
                if (isAutoPlaying) {
                    nextSlide();
                    setTimeout(() => startProgress(), 100);
                }
            } else {
                progressBar.style.width = progress + '%';
            }
        }, 16); // ~60fps
    }

    function stopProgress() {
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }
    }

    function startAutoPlay() {
        isAutoPlaying = true;
        startProgress();
    }

    function stopAutoPlay() {
        isAutoPlaying = false;
        stopProgress();
    }

    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            stopAutoPlay();
            
            showSlide(index);
            
            setTimeout(() => {
                startAutoPlay();
            }, 100);
        });
    });

    showSlide(0);
    startAutoPlay();
});