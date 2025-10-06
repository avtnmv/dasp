document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.what-you-get__accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.what-you-get__accordion-header');
        
        header.addEventListener('click', function() {
            // Закрываем все другие аккордеоны
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий аккордеон
            item.classList.toggle('active');
        });
    });
});
