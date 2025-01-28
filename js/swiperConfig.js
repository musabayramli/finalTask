// Swiper konfiqurasiyası funksiyası
function initializeSwiper(carouselClass, nextButtonClass, prevButtonClass) {
    new Swiper(carouselClass, {
        slidesPerView: 4,
        spaceBetween: 20,
        loop: true,
        
       
        breakpoints: {
            480: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
        },
    });
}
