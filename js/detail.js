document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalImage = document.querySelector("#openModal");
  const modalTitle = document.querySelector(".modal-box h1");
  const playButton = document.querySelector(".play-btn");

  if (!modal || !closeModal || !modalImage || !modalTitle || !playButton) {
    console.error(
      "Bəzi vacib elementlər tapılmadı. Zəhmət olmasa HTML-ni yoxlayın."
    );
    return;
  }
  // Fraqment üçün video elementi modal içində yaradılır
  const movieTrailer = document.createElement("video");
  movieTrailer.setAttribute("id", "movieTrailer");
  movieTrailer.setAttribute("width", "100%");
  movieTrailer.setAttribute("controls", "");
  movieTrailer.style.display = "none"; // Başlanğıcda video gizli olur
  modal.appendChild(movieTrailer); // Modalın içinə əlavə olunur

  // Şərh bölməsi üçün elementlər
  const commentInput = document.querySelector(".inp-bar input");
  const submitComment = document.querySelector(".sec2-btn");
  const commentList = document.querySelector(".sec2-commet");
  submitComment.addEventListener("click", (e) => {
    e.preventDefault();
    const commentText = commentInput.value.trim();

    if (commentText) {
      const now = new Date();
      const formattedDate = `${now.getHours()}:${now.getMinutes()} ${now.toLocaleDateString()}`;

      // Yeni şərh elementini yaradın
      const newComment = `
        <div class="commet-heading">
          <div class="commet-img">
            <img src="../images/default-user.jpg" alt="User" class="inp-img">
            <h4>İstifadəçi</h4>
          </div>
          <div>
            <span>${formattedDate}</span>
          </div>
        </div>
        <p>${commentText}</p>
      `;

      // Şərhi siyahıya əlavə edin
      commentList.innerHTML += newComment;

      // Input-u təmizləyin
      commentInput.value = "";
    }
  });

  // Film məlumatlarını API-dən almaq
  async function fetchMovieDetails() {
    const movieId = new URLSearchParams(window.location.search).get("id");

    if (!movieId) {
      console.error("Film ID tapılmadı.");
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
        return;
      }

      const { data } = await response.json();
      renderMovieDetails(data);
      await fetchComments(); // Şərhləri yükləyirik
    } catch (error) {
      console.error("Xəta baş verdi:", error);
    }
  }

  // Şərhləri API-dən almaq üçün funksiya
  async function fetchComments() {
    const movieId = new URLSearchParams(window.location.search).get("id");

    if (!movieId) return;

    try {
      const response = await fetch(`${API_URL}/${movieId}/comments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const { data } = await response.json();
        console.log(data);
        
        renderComments(data);
      } else {
        commentList.innerHTML = "<p>Şərhlər tapılmadı.</p>";
      }
    } catch (error) {
      console.error("Şərhlər yüklənərkən xəta baş verdi:", error);
    }
  }
  // Film detalları səhifəyə əlavə etmək
  function renderMovieDetails(data) {
    document.querySelector(".detail-bg img").src = data.cover_url;
    document.querySelector(".image-section img").src = data.cover_url;
    document.querySelector(".content-link h1").textContent = data.title;
    document.querySelector(".overview p").textContent = data.overview || "Təsvir mövcud deyil.";
    document.querySelector(".link").href = data.watch_url || "#";
  }

  function updateHeader(data) {
    const headerTitle = document.querySelector(".detail-position h5");
    headerTitle.textContent = data.title || "Film adı mövcud deyil.";
  }

  function renderFavoriteMovies(movies) {
    const swiperWrapper = document.querySelector(
      ".mySwiperComedy .swiper-wrapper"
    );

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

    new Swiper(".mySwiperComedy", {
      slidesPerView: 1,
      loop: movies.length > 1,
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 10 },
        480: { slidesPerView: 2, spaceBetween: 15 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 5, spaceBetween: 25 },
        1440: { slidesPerView: 6, spaceBetween: 30 },
      },
    });
  }

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
            <img src="${actor.image_url || "../images/default.jpg"}" alt="${
          actor.name
        }">
            <span>${actor.name}</span>
            <span>${actor.role || "Unknown Role"}</span>
          </div>
        `
      )
      .join("");
  }

  function renderComments(comments) {
    if (!comments.length) {
      commentList.innerHTML = "<p>Şərhlər tapılmadı.</p>";
      return;
    }

    commentList.innerHTML = comments
    .map(
      (comment) => `
        <div class="commet-heading">
          <div class="commet-img">
            <img src="${comment.user_image || "../images/default-user.jpg"}" alt="User" class="inp-img">
            <h4>${comment.user_name || "İstifadəçi"}</h4>
          </div>
          <div>
            <span>${new Date(comment.created_at).toLocaleString()}</span>
          </div>
        </div>
        <p>${comment.text}</p>
      `
    )
    .join("");
  }

  submitComment.addEventListener("click", async (e) => {
    e.preventDefault();
    const commentText = commentInput.value.trim();
    const movieId = new URLSearchParams(window.location.search).get("id");

    if (commentText && movieId) {
      try {
        const response = await fetch(`${API_URL}/${movieId}/comment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ comment: commentText }),
        });

        if (response.ok) {
          commentInput.value = ""; 
          await fetchComments(); 
        } else {
          alert("Şərh əlavə olunarkən xəta baş verdi!");
        }
      } catch (error) {
        console.error("Xəta baş verdi:", error);
      }
    }
  });
  document
    .querySelector(".plus-button")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      const movieId = new URLSearchParams(window.location.search).get("id");

      if (!movieId) return;

      try {
        const response = await fetch(
          `https://api.sarkhanrahimli.dev/api/filmalisa/movie/${movieId}/favorite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.ok) {
          alert("Film favorilere əlavə edildi!");
        } else {
          alert("Favorilere əlavə olunarkən xəta baş verdi!");
        }
      } catch (error) {
        console.error("Xəta baş verdi:", error);
      }
    });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
    movieTrailer.pause();
    movieTrailer.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      movieTrailer.pause(); 
      movieTrailer.style.display = "none"; 
    }
  });

  //404 səhifəsinə yönləndirmək
  /*   function redirectTo404() {
    window.location.href = "../pages/404.html";
  }
 */
  await fetchMovieDetails();
});
