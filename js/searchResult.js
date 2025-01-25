document.addEventListener('DOMContentLoaded', () => {
	fetchMovies();
	document.querySelector('.searchbar button').addEventListener('click', searchMovies);
	document.querySelector('.searchbar input').addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			searchMovies();
		}
	});
});

const skeleton = () => {
	let skeletonContent = '';
	for (let i = 0; i < 10; i++) {
		skeletonContent += `
            <div class="movie movie-skeleton">
                <div class="img-skeleton"></div>
                <div class="movieDescBox-skeleton">
                    <h4 class="text-skeleton"></h4>
                    <p class="text-skeleton"></p>
                </div>
            </div>
        `;
	}

	const movieContainer = document.querySelector('.movies');
	if (movieContainer) {
		movieContainer.innerHTML = skeletonContent;
	}
};

const fetchMovies = async (apiWithSearchParam = null) => {
	const apiUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/movies';
	const accessToken = localStorage.getItem('authToken');


	try {
		if (typeof accessToken === 'undefined' || accessToken == null) {
			throw new Error('accessToken is not defined');
		}
	} catch (error) {
		window.location.href = '../html/adminLogin.html';
		return;
	}

	skeleton();

	try {
		const response = await fetch(apiWithSearchParam || apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			// Token not found:
			if (response.status === 401) {
				Toastify({
					text: "First Login Please!",
					className: "error",
					gravity: "top",
					position: "center",
					duration: 1500,
					style: {
						background: "maroon",
					}
				}).showToast();

				localStorage.removeItem("authToken");
				window.location.href = "../pages/login.html";

			} else {
				Toastify({
					text: "Some Server Errors! Check API URL",
					className: "error",
					gravity: "top",
					position: "center",
					duration: 1500,
					style: {
						background: "maroon",
					}
				}).showToast();
			}

			return;
		}

		const { data } = await response.json();

		if (data.length > 0) {
			showMovies({ movies: data, status: true, searching: apiWithSearchParam ?? false })

		} else {

			showMovies({ status: false, searching: apiWithSearchParam ?? false })

			return;
		}
	} catch (error) {
		Toastify({
			text: "Inavil API URL",
			className: "error",
			gravity: "top",
			position: "center",
			duration: 1500,
			style: {
				background: "maroon",
			}
		}).showToast()
	}
};

const showMovies = async ({ movies, status, searching }) => {
	if (status) {
		if (searching) {
			// Searched movies:
			document.querySelector('.movies').innerHTML = movies.map(({ title, cover_url, category }) => {
				return `
					<div class="movie">
						<img src="${cover_url}" alt="Wonder Woman 1984" />
						<div class="movieDescBox">
							<h4>${category.name}</h4>
							<p>${title}</p>
						</div>
					</div>
				`;
			}).join('');

		} else {
			// High rank first movies:
			document.querySelector('.movies').innerHTML = movies.slice().sort((a, b) => b.imdb - a.imdb).map(({ id, title, cover_url, category }) => {
				return `
					<div class="movie" onclick="goDetailsPage(${id})">
						<img src="${cover_url}" alt="Wonder Woman 1984" />
						<div class="movieDescBox">
							<h4>${category.name}</h4>
							<p>${title}</p>
						</div>
					</div>
				`;
			}).join('');
		}

	} else {
		// Not any movies on database
		if (searching) {
			document.querySelector(".movies").innerHTML = '<div class="message">No movies found matching your search criteria.</div>';

		} else {
			Toastify({
				text: "Not any movies in database. Please add from admin panel.",
				className: "error",
				gravity: "top",
				position: "center",
				duration: 1500,
				style: {
					background: "maroon",
				}
			}).showToast();
		}
	}
}

const searchMovies = () => {
	const searchingMovie = document.querySelector('.searchbar input').value;
	const apiUrl = `https://api.sarkhanrahimli.dev/api/filmalisa/movies?search=${searchingMovie}`;

	fetchMovies(apiUrl);

}

const goDetailsPage = (id) => {
	window.location.href = `detail.htm?id=${id}`;

}