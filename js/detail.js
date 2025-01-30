document.addEventListener("DOMContentLoaded", async () => {
	const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
	const modal = document.getElementById("modal");
	const closeModal = document.getElementById("closeEdModal");
	const modalImage = document.querySelector("#openModal");
	const modalTitle = document.querySelector(".modal-box h1");
	const modalBox = document.querySelector(".modal-box");
	const playButton = document.querySelector(".play-btn");
	const modalImageElement = modal.querySelector("#modal img");
	const modalContent = modal.querySelector(".modal-content");
	const urlParams = new URLSearchParams(window.location.search);
	const movieId = urlParams.get("id");

	if (!movieId) {
		console.error("Film ID tapılmadı.");
		return;
	}

	if (!modal || !closeModal || !modalImage || !modalTitle || !playButton) {
		console.error(
			"Bəzi vacib elementlər tapılmadı. Zəhmət olmasamodal HTML-ni yoxlayın."
		);
		return;
	}

	// Filmin favorit olub-olmamasını yoxlayıb düyməni yeniləyirik
	updateFavoriteButton(movieId);

	function updateFavoriteButton(movieId) {
		const button = document.querySelector(".plus-button");

		if (isFavorite(movieId)) {
			button.classList.add("favorited");
			button.innerHTML = "➖";
		} else {
			button.classList.remove("favorited");
			button.innerHTML = "➕";
		}

		button.addEventListener("click", (e) => {
			e.preventDefault();
			toggleFavorite(movieId);
			updateFavoriteButton(movieId);
		});
	}

	function toggleFavorite(movieId) {
		let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

		if (favorites.includes(movieId)) {
			favorites = favorites.filter((fav) => fav !== movieId);
			alert("Film favorilərdən çıxarıldı!");
		} else {
			favorites.push(movieId);
			alert("Film favorilərə əlavə edildi!");
		}

		localStorage.setItem("favorites", JSON.stringify(favorites));
	}

	function isFavorite(movieId) {
		const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
		return favorites.includes(movieId);
	}

	// Fraqment üçün video elementi modal içində yaradılır
	const movieTrailer = document.createElement("video");
	movieTrailer.setAttribute("id", "movieTrailer");
	movieTrailer.setAttribute("width", "100%");
	movieTrailer.setAttribute("controls", "");
	movieTrailer.style.display = "none";
	modal.appendChild(movieTrailer);

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
            <img src="../images/default.jpg" alt="User" class="inp-img">
            <h4>Admin</h4>
          </div>
          <div>
            <span>${formattedDate}</span>
          </div>
        </div>
        <p>${commentText}</p>
      `;

			commentList.innerHTML += newComment;

			commentInput.value = "";
		}
	});

	const limitText = (text, limit) =>
		text.length > limit ? text.slice(0, limit) + "..." : text;

	// Film məlumatlarını API-dən almaq
	async function fetchMovieDetails() {
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
			renderTopCast(data.actors);
			await fetchComments();

			// Similar Movies üçün uyğun kategoriya ilə çağırış
			fetchSimilarMovies(data.category.id);

			videoUrl = data.fragman || "";
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
		const movieTitleElement = document.getElementById("movieTitle");
		if (movieTitleElement) {
			movieTitleElement.textContent = data.title || "Film adı yoxdur";
		}

		const overviewElement = document.querySelector(".overview p");
		const toggleButton = document.createElement("button");
		toggleButton.textContent = "Daha çox";
		toggleButton.classList.add("toggle-button");
		toggleButton.setAttribute("id", "toggleOverview");

		let isExpanded = false;

		const updateOverview = () => {
			overviewElement.innerHTML = isExpanded
				? `${data.overview} <button id="toggleOverview" class="toggle-button">Daha az</button>`
				: `${limitText(
					data.overview,
					150
				)} <button id="toggleOverview" class="toggle-button">Daha çox</button>`;
		};

		overviewElement.addEventListener("click", (event) => {
			if (event.target.id === "toggleOverview") {
				isExpanded = !isExpanded;
				updateOverview();
			}
		});

		updateOverview();

		const movieTrailerIframe = document.createElement("iframe");
		movieTrailerIframe.setAttribute("width", "100%");
		movieTrailerIframe.setAttribute("height", "100%");
		movieTrailerIframe.setAttribute("frameborder", "0");
		movieTrailerIframe.setAttribute(
			"allow",
			"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		);
		movieTrailerIframe.style.display = "none";
		modalContent.appendChild(movieTrailerIframe);

		// Play düyməsinə klikləmə funksiyası
		playButton.addEventListener("click", () => {
			if (videoUrl) {
				modal.classList.add("active");

				modalImageElement.style.display = "none";
				modalBox.style.display = "none";
				movieTrailerIframe.style.display = "block";
				movieTrailerIframe.src = `https://www.youtube.com/embed/${getYouTubeVideoId(
					videoUrl
				)}?autoplay=1`;
			} else {
				alert("Fraqment URL tapılmadı!");
			}
		});

		// Modalı açmaq üçün:
		modalImage.addEventListener("click", () => {
			modal.classList.add("active");
			modalTitle.textContent = data.title || "Film Adı";
			modalImageElement.src = data.cover_url || "";
		});

		// Modalı bağlamaq üçün:
		closeModal.addEventListener("click", () => {
			modal.classList.remove("active");
			movieTrailerIframe.style.display = "none";
			movieTrailerIframe.src = "";
			modalBox.style.display = "block";
			modalImageElement.style.display = "block";
		});

		// YouTube video ID-ni çıxarmaq üçün funksiya
		function getYouTubeVideoId(url) {
			const regExp =
				/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
			const match = url.match(regExp);
			return match && match[1] ? match[1] : null;
		}

		document.querySelector(".detail-bg img").src = data.cover_url;
		document.querySelector(".image-section img").src = data.cover_url;
		document.querySelector(".content-link h1").textContent = data.title;
		document.querySelector(".link").href = data.watch_url || "#";
	}

	function renderTopCast(actors) {
		const castContainer = document.querySelector(".cast");

		if (!actors || actors.length === 0) {
			castContainer.innerHTML = "<p>Top Cast məlumatı tapılmadı.</p>";
			return;
		}

		castContainer.innerHTML = actors
			.map(
				(actor) => ` 
        <div class="actor">
          <img src="${actor.img_url || "../images/default.jpg"}" alt="${actor.name
					} ${actor.surname}">
          <span>${actor.name} ${actor.surname}</span>
          <span>${actor.role || "Unknown Role"}</span>
        </div>`
			)
			.join("");
	}

	// Şərhləri göstərmək üçün funksiya
	function renderComments(comments) {
		const commentList = document.querySelector(".sec2-commet");

		if (!comments || comments.length === 0) {
			commentList.innerHTML = "<p>Şərhlər tapılmadı.</p>";
			return;
		}

		commentList.innerHTML = comments
			.map(
				(comment) => ` 
        <div class="commet-heading">
          <div class="commet-img">
            <img src="${comment.user_image || "../images/default.jpg"
					}" alt="User" class="inp-img">
            <h4>${comment.user_name || "Admin"}</h4>
          </div>
          <div>
            <span>${new Date(comment.created_at).toLocaleString()}</span>
          </div>
        </div>
        <p>${comment.comment}</p>`
			)
			.join("");
	}

	async function fetchSimilarMovies(categoryId) {
		try {
			const response = await fetch(API_URL, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
				},
			});

			if (!response.ok) {
				console.error("Bənzər filmlər tapılmadı.");
				return;
			}

			const { data } = await response.json();

			let similarMovies = data.filter(
				(movie) => movie.category.id === categoryId
			).filter((movie) => movie.id !== Number(movieId));

			renderSimilarMovies(similarMovies);
		} catch (error) {
			console.error("Bənzər filmləri yükləyərkən xəta baş verdi:", error);
		}
	}

	function renderSimilarMovies(movies) {
		const swiperWrapper = document.querySelector(
			".mySwiperSimilar .swiper-wrapper"
		);

		if (movies.length === 0) {
			swiperWrapper.innerHTML = "<p>Bənzər filmlər tapılmadı.</p>";
			return;
		}

		swiperWrapper.innerHTML = movies
		.map(
		  (movie) => `
		  <div class="swiper-slide" onclick="window.location.href='${window.location.origin}/pages/detail.htm?id=${movie.id}'" style="cursor: pointer;">
			 <img src="${movie.cover_url}" alt="${movie.title}" />
			 <div class="box">
				<!--<span>${movie.category?.name || "Unknown"}</span>-->
				<p>${movie.title}</p>
			 </div>
		  </div>`
		)
		.join("");
	 


		new Swiper(".mySwiperSimilar", {
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

	window.addEventListener("click", (e) => {
		if (e.target === modal) {
			modal.classList.remove("active");
			movieTrailer.style.display = "none";
		}
	});

	await fetchMovieDetails();
});
