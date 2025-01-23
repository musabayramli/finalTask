var swiperComedy = new Swiper(".mySwiperComedy", {
    slidesPerView: 1,
    loop: true,
    breakpoints: {
        320: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        480: {
            slidesPerView: 2,
            spaceBetween: 15,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 5,
            spaceBetween: 25,
        },
        1440: {
            slidesPerView: 6,
            spaceBetween: 30,
        },
    },
});

// API-dən məlumatları çəkmək üçün funksiya
async function fetchFavoriteMovies() {
    const API_URL = "http://localhost:3000/api/filmalisa/movies/favorites"; // Local API
    const token = "Bearer YOUR_TOKEN_HERE"; // Buraya öz tokeninizi yazın

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token, // Token başlığı
            },
        });

        if (!response.ok) {
            throw new Error("API-dən məlumat alınmadı");
        }

        const data = await response.json();

        // Məlumatları DOM-a əlavə et
        const moviesContainer = document.getElementById("favorite-movies");
        data.forEach(movie => {
            const slide = document.createElement("div");
            slide.classList.add("swiper-slide");
            slide.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}" />
                <div class="box">
                    <span>${movie.genre}</span>
                    <p>${movie.title}</p>
                </div>
            `;
            moviesContainer.appendChild(slide);
        });

        // Swiper yenidən qurulması
        swiperComedy.update();
    } catch (error) {
        console.error("Xəta baş verdi:", error.message);
    }
}

// Funksiyanı çağır
fetchFavoriteMovies();
