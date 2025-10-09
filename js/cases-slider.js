const swiper = new Swiper('.cases-swiper', {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 24,
    loop: true,
    speed: 600,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
  
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      }
    }
});
  