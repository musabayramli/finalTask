// API-dən favorite filmləri çəkmək üçün funksiya
async function fetchFavoriteMovies() {
  const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
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
    if (!data || data.length === 0) {
      console.error("Sevimli filmlər tapılmadı və ya boş gəlir.");
    }

    const localFavorites = (
      JSON.parse(localStorage.getItem("favorites")) || []
    ).map((id) => Number(id));
    const allFavorites = [...data];

    const uniqueFavorites = allFavorites.filter((movie) =>
      localFavorites.includes(movie.id)
    );

    const allUniqueFavorites = [
      ...uniqueFavorites,
      ...localFavorites.filter(
        (id) => !allFavorites.some((movie) => movie.id == id)
      ),
    ].map(
      (id) =>
        allFavorites.find((movie) => movie.id == id) || {
          id: id,
          title: "Unknown",
        }
    );

    const moviesContainer = document.getElementById("favorite-movies");
    if (!moviesContainer) {
      console.error("Movies container not found");
      return;
    }

    allUniqueFavorites.forEach((movie) => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      const {} = movie

      slide.setAttribute("data-id", movie.id.id);  
      slide.innerHTML = ` 
         <img src="${movie.id.cover_url || "../images/default.jpg"}" alt="${movie.id.title}" />
        <div class="box">
          <span>${movie.id.category?.name || "Unknown Genre"}</span>
          <p>${movie.id.title}</p>
        </div>
      `;

      slide.addEventListener("click", () => {
        const movieId = movie.id.id; 
        window.location.href = `../pages/detail.htm?id=${movieId}`;
      });

      moviesContainer.appendChild(slide);
    });

    // Yoxlama: Swiper elementinin yaradıldığını və düzgün işlədyini yoxlayaq
    if (typeof swiperComedy !== "undefined") {
      swiperComedy.update();
    } else {
      console.error("Swiper elementinin obyektinə giriş mümkün olmadı!");
    }
  } catch (error) {
    console.error("Xəta baş verdi:", error.message);
  }
}

fetchFavoriteMovies();
