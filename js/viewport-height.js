(function() {
    'use strict';

    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }

    setViewportHeight();

    window.addEventListener('resize', setViewportHeight);

    window.addEventListener('orientationchange', function() {
        setTimeout(setViewportHeight, 100);
    });

    let timeoutId;
    window.addEventListener('scroll', function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(setViewportHeight, 150);
    });

})();
