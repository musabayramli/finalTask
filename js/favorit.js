// API-dən favorite filmləri çəkmək üçün funksiya
async function fetchFavoriteMovies() {
  const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites";
  const token = `Bearer ${localStorage.getItem("authToken")}`;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("API-dən məlumat alınmadı");
    }

    const { data } = await response.json();
    
    // Yoxlama: Serverdən gələn data doğru olub-olmaması
    if (!data || data.length === 0) {
      console.error("Sevimli filmlər tapılmadı və ya boş gəlir.");
      return;
    }

    const moviesContainer = document.getElementById("favorite-movies");
    if (!moviesContainer) {
      console.error("Movies container not found");
      return;
    }

    // API-dən gələn filmləri DOM-a əlavə et
    data.forEach((movie) => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      slide.setAttribute("data-id", movie.id);
      slide.innerHTML = `
        <img src="${movie.cover_url}" alt="${movie.title}" />
        <div class="box">
          <span>${movie.genre || "Unknown Genre"}</span>
          <p>${movie.title}</p>
        </div>
      `;

      slide.addEventListener("click", () => {
        const movieId = movie.id;
        window.location.href = `../pages/detail.htm?id=${movieId}`;
      });

      moviesContainer.appendChild(slide);
    });

    // Yoxlama: Swiper elementinin yaradıldığını və düzgün işlədyini yoxlayaq
    if (typeof swiperComedy !== 'undefined') {
      swiperComedy.update();
    } else {
      console.error("Swiper elementinin obyektinə giriş mümkün olmadı!");
    }

  } catch (error) {
    console.error("Xəta baş verdi:", error.message);
  }
}

// Filmə favori əlavə etmək
function addMovieToFavorites(movie) {
  // Bu hissə `localStorage`-i istifadə etmir, sadəcə API ilə əlaqəli olacaq
  alert("Film favorilərə əlavə edildi!");
  fetchFavoriteMovies();  // Yeni favoritləri göstər
}

// İlk dəfə favoritləri yükləyirik
fetchFavoriteMovies(); 
