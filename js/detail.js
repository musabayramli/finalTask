document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalImage = document.querySelector(".modal-content img");
  const modalTitle = document.querySelector(".modal-box h1");

  // Şərh bölməsi üçün elementlər
  const commentInput = document.querySelector(".inp-bar input");
  const submitComment = document.querySelector(".sec2-btn");
  const commentList = document.querySelector(".sec2-commet");

  // Film məlumatlarını API-dən almaq
  async function fetchMovieDetails() {
    const movieId = new URLSearchParams(window.location.search).get("id");

    if (!movieId) {
      console.error("Movie ID tapılmadı. Əsas səhifəyə yönləndirilir.");
      window.location.href = "../pages/home.html";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${movieId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        console.error("Film məlumatı alınmadı.");
        if (response.status === 404) {
          window.location.href = "../pages/home.html";
        }
        return;
      }

      const { data } = await response.json();
      console.log("Gələn məlumat:", data);
      renderMovieDetails(data);
      renderFavoriteMovies(data.related_movies || []);
      renderTopCast(data.actors || []);
      updateHeader(data);
    } catch (error) {
      console.error("Xəta baş verdi:", error);
    }
  }

  // Film detalları səhifəyə əlavə etmək
  function renderMovieDetails(data) {
    document.querySelector(".detail-bg img").src = data.cover_url;
    document.querySelector(".image-section img").src = data.cover_url;
    document.querySelector(".content-link h1").textContent = data.title;
    const overviewElement = document.querySelector(".content-section p");

    // Qısa məzmun funksionallığı
    const fullText = data.overview || "Təsvir mövcud deyil.";
    const shortText = fullText.length > 150 ? fullText.slice(0, 150) + "..." : fullText;

    overviewElement.innerHTML = `
      <span class="short-text">${shortText}</span>
      <span class="full-text" style="display:none;">${fullText}</span>
      ${
        fullText.length > 150
          ? '<button class="read-more" id="toggleOverview">Daha çox oxu</button>'
          : ""
      }
    `;

    const readMoreButton = document.querySelector(".read-more");
    if (readMoreButton) {
      readMoreButton.addEventListener("click", () => {
        const shortTextElement = document.querySelector(".short-text");
        const fullTextElement = document.querySelector(".full-text");
        if (fullTextElement.style.display === "none") {
          fullTextElement.style.display = "inline";
          shortTextElement.style.display = "none";
          readMoreButton.textContent = "Daha az göstər";
        } else {
          fullTextElement.style.display = "none";
          shortTextElement.style.display = "inline";
          readMoreButton.textContent = "Daha çox oxu";
        }
      });
    }

    document.querySelector(".link").href = data.watch_url || "#";

    // Genres
    const genresContainer = document.querySelector(".genres");
    genresContainer.innerHTML = data.category
      ? `<span>${data.category.name}</span>`
      : "Genre məlumatı yoxdur.";
  }

  // Başlıq hissəsini yeniləmək
  function updateHeader(data) {
    const headerTitle = document.querySelector(".detail-position h5");
    if (headerTitle) {
      headerTitle.textContent = data.title || "Film adı mövcud deyil.";
    }
  }

  // **Favorite Movies** bölməsini render etmək
  function renderFavoriteMovies(movies) {
    const swiperWrapper = document.querySelector(".mySwiperComedy .swiper-wrapper");

    if (movies.length === 0) {
      swiperWrapper.innerHTML = "<p>Sevimli filmlər tapılmadı.</p>";
      return;
    }

    swiperWrapper.innerHTML = movies
      .map(
        (movie) => `
          <div class="swiper-slide">
            <img src="${movie.cover_url}" alt="${movie.title}" />
            <div class="box">
              <span>${movie.category?.name || "Unknown"}</span>
              <p>${movie.title}</p>
            </div>
          </div>
        `
      )
      .join("");

    // Swiper üçün yenidən başlatma
    new Swiper(".mySwiperComedy", {
      slidesPerView: 1,
      loop: true,
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 10 },
        480: { slidesPerView: 2, spaceBetween: 15 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 5, spaceBetween: 25 },
        1440: { slidesPerView: 6, spaceBetween: 30 },
      },
    });
  }

  // **Top Cast** bölməsini render etmək
  function renderTopCast(actors) {
    const castContainer = document.querySelector(".cast");

    if (actors.length === 0) {
      castContainer.innerHTML = "<p>Top Cast məlumatı tapılmadı.</p>";
      return;
    }

    castContainer.innerHTML = actors
      .map(
        (actor) => `
          <div class="actor">
            <img src="${actor.image_url || '../images/default.jpg'}" alt="${actor.name}">
            <span>${actor.name}</span>
            <span>${actor.role || "Unknown Role"}</span>
          </div>
        `
      )
      .join("");
  }

  // Modal funksionallığı
  document.getElementById("openModal").addEventListener("click", () => {
    modal.style.display = "flex";
    modalImage.src = document.querySelector(".image-section img").src;
    modalTitle.textContent = document.querySelector(".content-link h1").textContent;
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Şərhlər əlavə etmək
  submitComment.addEventListener("click", (e) => {
    e.preventDefault();
    const commentText = commentInput.value.trim();
    if (commentText) {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("commet-heading");
      commentDiv.innerHTML = `
        <div class="commet-img">
          <img src="../images/default.jpg" alt="User">
          <h4>Anonymous</h4>
        </div>
        <div>
          <span>${new Date().toLocaleTimeString()}</span>
          <span>${new Date().toLocaleDateString()}</span>
        </div>
        <p>${commentText}</p>
      `;
      commentList.appendChild(commentDiv);
      commentInput.value = "";
    }
  });

  // Film məlumatlarını yüklə
  await fetchMovieDetails();
});
