document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";

  // API-dən məlumat çəkmək
  async function fetchMovies() {
    const token = localStorage.getItem("authToken");

    // Token yoxlanışı
    if (!token) {
      console.error("Token tapılmadı. Login səhifəsinə yönləndirilir.");
      window.location.href = "../pages/login.html";
      return;
    }

    try {
      // API sorğusu
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Əgər 401 gəlirsə, token etibarsızdır
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Token etibarsızdır. Login səhifəsinə yönləndirilir.");
          localStorage.removeItem("authToken");
          window.location.href = "../pages/login.html";
        } else {
          throw new Error("API-dən məlumat alınmadı");
        }
        return;
      }

      // Gələn məlumatı al
      const responseData = await response.json();
      renderHeaderMovies(responseData.data);
      renderCategories(responseData.data);
    } catch (error) {
      console.error("Xəta baş verdi:", error);
    }
  }

  // Header üçün carusel yaratmaq
  function renderHeaderMovies(movies) {
    const headerSwiperWrapper = document.querySelector(
      ".mySwiperHeader .swiper-wrapper"
    );
    if (!headerSwiperWrapper) {
      console.error("'mySwiperHeader' elementi tapılmadı.");
      return;
    }

    console.log(movies);

    headerSwiperWrapper.innerHTML = movies
      .map((movie, index) => {
        const imdbRating = parseFloat(movie.imdb) || 0;
        let starIcon = "";

        if (imdbRating >= 8.0) {
          starIcon = "⭐️⭐️⭐️⭐️⭐️";
        } else if (imdbRating >= 7.0) {
          starIcon = "⭐️⭐️⭐️⭐️";
        } else if (imdbRating >= 5.0) {
          starIcon = "⭐️⭐️⭐️";
        } else {
          starIcon = "⭐️";
        }

        return `
          <div class="swiper-slide">
              <img src="${movie.cover_url}" alt="${movie.title}">
              <div class="header-content">
                  <span>${movie.category.name}</span>
							<p class="imdb-rating">${starIcon}</p>
							<h1>${movie.title}</h1>
							<p style="
								background: linear-gradient(to right, 
									transparent, 
									rgba(0, 0, 0, 0.5), 
									transparent
								);
								color: white; 
								padding: 20px; 
								position: relative;
								left: -20px; 
							">${movie.overview.slice(0, 300) + "...." || "No description available."}</p>
                  <button class="watch-now" data-id="${
                    movie.id
                  }">Watch Now</button>
              </div>
          </div>
      `;
      })
      .join("");
    // "Watch Now" düyməsinə klik hadisəsi əlavə et
    document.querySelectorAll(".watch-now").forEach((button) => {
      button.addEventListener("click", (event) => {
        const movieId = event.currentTarget.getAttribute("data-id");
        window.location.href = `../pages/detail.htm?id=${movieId}`;
      });
    });
  }

  // Kateqoriyalara əsasən karusellər yaratmaq
  function renderCategories(movies) {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) {
      console.error("'main-content' elementi tapılmadı.");
      return;
    }

    const categories = {};

    // Filmləri kateqoriyalara görə qruplaşdır
    movies.forEach((movie) => {
      const categoryName = movie.category?.name || "Unknown";
      if (!categories[categoryName]) {
        categories[categoryName] = [];
      }
      categories[categoryName].push(movie);
    });

    // Hər bir kateqoriya üçün karusel yaratmaq
    Object.keys(categories).forEach((categoryName) => {
      const categoryId = `swiper-${categoryName
        .replace(/\s+/g, "-")
        .toLowerCase()}`;

      // Karusel şablonu
      const carousel = document.createElement("section");
      carousel.classList.add("movie-carousel");
      carousel.innerHTML = `
                <h2>${categoryName} <a href="#">&#x276F;</a></h2>
                <div class="swiper ${categoryId}">
                    <div class="swiper-wrapper">
                        ${categories[categoryName]
                          .map((movie) => {
                            // IMDb reytinqinə əsasən ulduzları təyin et
                            const imdbRating = parseFloat(movie.imdb) || 0;
                            let starIcon = "";

                            if (imdbRating >= 8.0) {
                              starIcon = "⭐️⭐️⭐️⭐️⭐️";
                            } else if (imdbRating >= 7.0) {
                              starIcon = "⭐️⭐️⭐️⭐️";
                            } else if (imdbRating >= 5.0) {
                              starIcon = "⭐️⭐️⭐️";
                            } else {
                              starIcon = "⭐️";
                            }

                            return `
                            <div class="swiper-slide movie-card" data-id="${movie.id}">
                                <img src="${movie.cover_url}" alt="${movie.title}">
                                <div class="box">
                                    <span>${categoryName}</span>
                                    <p class="imdb-rating">${starIcon}</p>
                                    <p>${movie.title}</p>
                                </div>
                            </div>
                            `;
                          })
                          .join("")}
                    </div>
                    <div class="swiper-button-next swiper-${categoryId}-next"></div>
                    <div class="swiper-button-prev swiper-${categoryId}-prev"></div>
                </div>
            `;
      mainContent.appendChild(carousel);

      // Swiper-in hərəkətliliyini təmin et
      initializeSwiper(
        `.${categoryId}`,
        `.swiper-${categoryId}-next`,
        `.swiper-${categoryId}-prev`
      );
    });

    // Kartlara klik funksiyası əlavə et
    document.querySelectorAll(".movie-card").forEach((card) => {
      card.addEventListener("click", (event) => {
        const movieId = event.currentTarget.getAttribute("data-id");
        window.location.href = `../pages/detail.htm?id=${movieId}`;
      });
    });

    // "Watch Now" düyməsinə klik hadisəsi əlavə et
    document.querySelectorAll(".watch-now").forEach((button) => {
      button.addEventListener("click", (event) => {
        const movieId = event.currentTarget.getAttribute("data-id");
        window.location.href = `../pages/detail.htm?id=${movieId}`;
      });
    });
  }

  // Swiper konfiqurasiyası
  function initializeSwiper(carouselClass, nextButtonClass, prevButtonClass) {
    new Swiper(carouselClass, {
      slidesPerView: 4,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: nextButtonClass,
        prevEl: prevButtonClass,
      },
      breakpoints: {
        300: { slidesPerView: 1, spaceBetween: 5 },
        480: { slidesPerView: 1, spaceBetween: 10 },
        768: { slidesPerView: 2, spaceBetween: 15 },
        1024: { slidesPerView: 4, spaceBetween: 20 },
      },
    });
  }

  fetchMovies();
});
