// API-dən favorite filmləri çəkmək üçün funksiya
async function fetchFavoriteMovies() {
    const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites";
    const token = `Bearer ${localStorage.getItem("authToken")}`; 

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
        });

        if (!response.ok) {
            throw new Error("API-dən məlumat alınmadı");
        }

        const { data } = await response.json();
        console.log("Gələn məlumat:", data); 

        const movies = data; 
        const moviesContainer = document.getElementById("favorite-movies");

        if (!movies || movies.length === 0) {
            moviesContainer.innerHTML = "<p>Sevimli filmlər tapılmadı.</p>";
            return;
        }

        // Məlumatları DOM-a əlavə et
        movies.forEach(movie => {
            const slide = document.createElement("div");
            slide.classList.add("swiper-slide");
            slide.innerHTML = `
                <img src="${movie.cover_url}" alt="${movie.title}" />
                <div class="box">
                    <span>${movie.genre || "Unknown Genre"}</span>
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

fetchFavoriteMovies();
