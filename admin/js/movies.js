const pageRight = document.querySelector(".page-right");
let isCategories = null;
let isActors = null;
let allCategories = [];
let allActors = [];


document.addEventListener('DOMContentLoaded', () => {
	fetchMovies();
	fetchCategoriesAndActors('EDIT');

	document.querySelector('.modal-overlay').addEventListener('click', hideModal)
});


//GET CATEGORIES AND ACTORS FIRST
const fetchCategoriesAndActors = async (type) => {
	const apiCategoryUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories';
	const apiActorUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors';
	const accessToken = localStorage.getItem('authToken');

	try {
		if (!accessToken) {
			throw new Error('accessToken is not defined');
		}
	} catch (error) {
		window.location.href = '../html/adminLogin.html';
		return;
	}

	try {
		const headers = {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		};

		const requests = [
			fetch(apiCategoryUrl, { method: 'GET', headers }),
			fetch(apiActorUrl, { method: 'GET', headers })
		];

		const results = await Promise.allSettled(requests);

		const categories = results[0].status === 'fulfilled' ? await results[0].value.json() : [];
		const actors = results[1].status === 'fulfilled' ? await results[1].value.json() : [];


		if (results[0].status === 'rejected' || categories.statusCode != undefined) {
			isCategories = `Categories API request failed: ${categories.statusCode}`;
		}

		if (results[1].status === 'rejected' || actors.statusCode != undefined) {
			isActors = `Actors API request failed: ${actors.statusCode}`;
		}

		if (categories.data.length < 0) {
			isCategories = 'Categories Data Not Added';
		}
		if (actors.data.length < 0) {
			isActors = 'Actors Data Not Added';
		}

		allCategories = categories.data;
		allActors = actors.data;

		if (type != 'EDIT') {
			//Handle datas
			document.querySelector('#select-box.movieCategory').innerHTML += categories.data.map(({ id, name }) => {
				return `
					<option value="${id}">${name}</option>
				`;
			}).join('');

			document.querySelector('#select-box.movieActors').innerHTML += actors.data.map(({ id, name, surname }) => {
				return `
					<option value="${id}">${name} ${surname}</option>
				`;
			}).join('');

			MultiselectDropdown(window.MultiselectDropdownOptions);
		}

	} catch (error) {
		console.error('An error occurred while fetching data:', error);

		Toastify({
			text: "Some API Errors: Control Logs Please!",
			className: "error",
			gravity: "top",
			position: "center",
			duration: 1500,
			style: {
				background: "maroon",
			}
		}).showToast();
	}
};

// Open Create Modal
function categoryaAndActorControl(categoryMessage = null, actorsMessage = null) {

	if (categoryMessage != null && actorsMessage != null) {
		Toastify({
			text: "First Create Categories and Actors Please!",
			className: "error",
			gravity: "top",
			position: "center",
			duration: 1500,
			style: {
				background: "maroon",
			}
		}).showToast();

		return;

	} else if (categoryMessage != null) {
		Toastify({
			text: "First Create Categories Please!",
			className: "error",
			gravity: "top",
			position: "center",
			duration: 1500,
			style: {
				background: "maroon",
			}
		}).showToast();

		return;

	} else if (actorsMessage != null) {
		Toastify({
			text: "First Create Actors Please!",
			className: "error",
			gravity: "top",
			position: "center",
			duration: 1500,
			style: {
				background: "maroon",
			}
		}).showToast();

		return;
	}
}


// Show Movie Modal
function modalShow(type) {
	const modalOverlay = document.querySelector(".modal-overlay");
	const modal = document.querySelector(".modal");

	modalOverlay.style.visibility = "visible";
	modal.style.visibility = "visible";

	if (type != 'EDIT') {
		modal.innerHTML = `
			<div class="modal-content">
				<!-- LEFT -->
				<div class="modal-left">
					<input
						type="text"
						placeholder="title"
						class="movieTitle"
					/>
					<textarea
						placeholder="overview"
						class="movieOverview"
					></textarea>
					<input
						type="url"
						placeholder="cover url"
						class="movieCoverUrl"
					/>
					<input
						type="url"
						placeholder="fragman(youtube embed url)"
						class="movieFragman"
					/>
					<input
						type="url"
						placeholder="watch url"
						class="movieWatchUrl"
					/>
					<input
						type="number"
						placeholder="imdb"
						class="movieImdb"
					/>
					<input
						type="number"
						placeholder="run time minute"
						class="movieRunTimeMin"
					/>
					<label for="select-box" class="category">
						<select id="select-box" class="movieCategory">
							<option value="" disabled selected hidden>
								Category
							</option>
						</select>
						<i class="down fa-solid fa-chevron-down"></i>
					</label>
					<label for="select-box" class="category">
						<select id="select-box" multiple class="movieActors">
							<optgroup label="Actors"></optgroup>
						</select>
						<i class="down fa-solid fa-chevron-down"></i>
					</label>
					<div class="form">
						<div class="checkbox">
							<label for="check">Adult</label>
							<input
								id="check"
								type="checkbox"
								class="movieAdult"
							/>
						</div>
						<button class="submit">Create</button>
					</div>
				</div>
				<!-- RIGHT -->
				<figure class="modal-image movieCoverImage">
					<img
						src="https://fitowatt.ru/assets/static/noimage.jpg"
						alt="poster"
						style="object-fit: cover"
					/>
				</figure>
			</div>
		`;

		fetchCategoriesAndActors();

		document.querySelector(".submit").className = "submit CreateMovie";
		document.querySelector('#modal button.CreateMovie').addEventListener('click', createMovie);
	}

	document.querySelector('.movieCoverUrl').addEventListener('input', checkImageUrl);
	categoryaAndActorControl(isCategories, isActors);
}

function hideModal() {
	const modal = document.querySelector(".modal");
	const modalOverlay = document.querySelector(".modal-overlay");
	modalOverlay.style.visibility = "hidden";
	modal.style.visibility = "hidden";
}

// Check Input Img Url
function checkImageUrl() {
	const input = document.querySelector('.movieCoverUrl');
	const img = document.querySelector('.movieCoverImage img');
	const url = input.value;

	if (url) {

		const testImg = new Image();

		testImg.onload = function () {
			img.src = url;
		};

		testImg.onerror = function () {
			img.src = 'https://askjan.org/publications/consultants-corner/images/online.jpg';
		};

		testImg.src = url;
	} else {
		img.src = 'https://askjan.org/publications/consultants-corner/images/online.jpg';
	}
}


//EDIT MODAL #################################
function editMovieRow(movieId) {

	const editModal = document.querySelector("#modal.modal");

	fetch(`https://api.sarkhanrahimli.dev/api/filmalisa/movies/${movieId}`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
			'Content-Type': 'application/json'
		}
	})
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error('Server Error');
		})
		.then(({ data }) => {
			const { title, cover_url, fragman, watch_url, adult, run_time_min, imdb, overview, category, actors } = data;

			editModal.innerHTML = `
			<div class="modal-content">
				<!-- LEFT -->
				<div class="modal-left">
					<input type="text" placeholder="title" class="movieTitle" value="${title}" />
					<textarea placeholder="overview" class="movieOverview">${overview}</textarea>
					<input type="url" placeholder="cover url" class="movieCoverUrl" value="${cover_url}" />
					<input
						type="url"
						placeholder="fragman(youtube embed url)" class="movieFragman"
						value="${fragman}"
					/>
					<input type="url" placeholder="watch url" class="movieWatchUrl" value="${watch_url}" />
					<input type="number" placeholder="imdb" class="movieImdb" value="${imdb}" />
					<input type="number" placeholder="run time minute" class="movieRunTimeMin" value="${run_time_min}" />
					<label for="select-box" class="category">
						<select id="select-box" class="movieCategory">
							<option value="${category.id}" disabled selected hidden>${category.name}</option>
							${allCategories.map(category => `<option value="${category.id}">${category.name}</option>`).join('')}
						</select>
						<i class="down fa-solid fa-chevron-down"></i>
					</label>


					<label for="select-box" class="category">
						<select id="select-box" multiple class="movieActors" 
						>
							${allActors.map(actor => {
				const isSelected = actors.some(a => a.id === actor.id) ? 'selected' : '';
				return `
									<option value="${actor.id}" ${isSelected}>
										${actor.name} ${actor.surname}
									</option>`;
			}).join('')}
						</select>
						<i class="down fa-solid fa-chevron-down"></i>
					</label>
					
					<div class="form">
						<div class="checkbox">
							<label for="check">Adult</label>
							<input id="check" type="checkbox" class="movieAdult" ${adult ? 'checked' : ''} />
						</div>
						<button class="submit EditMovie" onclick="editMovie(${movieId})">
							Edit
						</button>
					</div>
				</div>
				<!-- RIGHT -->
				<figure class="modal-image movieCoverImage">
					<img src="${cover_url}" alt="poster" />
				</figure>
			</div>
		`;

			MultiselectDropdown(window.MultiselectDropdownOptions);
			modalShow('EDIT');
		})
		.catch(error => {
			console.error('Fetch error:', error);
		});


	// cancelBtn.onclick = () => {
	// 	modalEditHide();
	// };
}

//HIDE EDIT MODAL
function modalEditHide() {
	const removeModal = document.querySelector("#detailsModal");
	const modalOverlay = document.querySelector(".modal-details-overlay");

	removeModal.classList.remove("modal-hidden");
	modalOverlay.style.visibility = "hidden";
	pageRight.style.backgroundColor = "#171616";
}


//SHOW REMOVE MODAL #################################
function removeMovieRow(el, movieId) {
	const removeModal = document.querySelector("#removeModal");
	const modalOverlay = document.querySelector(".modal-remove-overlay");
	const cancelBtn = document.querySelector("#removeModal .cancelBtn");
	const okBtn = document.querySelector("#removeModal .okBtn");

	removeModal.classList.add("modal-hidden");
	modalOverlay.style.visibility = "visible";
	pageRight.style.backgroundColor = "#090909";


	okBtn.onclick = () => {
		modalHide();
		const row = el.closest("tr");
		setTimeout(() => {
			if (row) {
				row.remove();
				deleteMovies(movieId);
			}
		}, 300);
	};

	cancelBtn.onclick = () => {
		modalHide();
	};
}

//HIDE REMOVE MODAL
function modalHide() {
	const removeModal = document.querySelector("#removeModal");
	const modalOverlay = document.querySelector(".modal-remove-overlay");

	removeModal.classList.remove("modal-hidden");
	modalOverlay.style.visibility = "hidden";
	pageRight.style.backgroundColor = "#171616";
}



// API -----------------------
function skeleton() {
	document.querySelector('thead').innerHTML = `
		<tr class="skeleton-row dark-skeleton">
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
		</tr>
	`;
	document.querySelector('tbody').innerHTML = `
		<tr class="skeleton-row">
			<td><div class="skeleton"></div></td>
			<td><div class="skeleton"></div></td>
			<td><div class="skeleton"></div></td>
			<td><div class="skeleton"></div></td>
			<td><div class="skeleton"></div></td>
			<td><div class="skeleton"></div></td>
			<td><div class="skeleton"></div></td>
		</tr>
	`;
}

function notDataFound() {
	document.querySelector('thead').innerHTML = `
		<tr class="skeleton-row dark-skeleton">
			<th>N/A</th>
			<th>N/A</th>
			<th>N/A</th>
			<th>N/A</th>
			<th>N/A</th>
			<th>N/A</th>
			<th>N/A</th>
		</tr>
	`;
	document.querySelector('tbody').innerHTML = `
		<tr class="skeleton-row">
			<td colspan="7">Not Movies Found in Database</td>
		</tr>
	`;
}

const fetchMovies = async () => {
	const apiUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies';
	const accessToken = localStorage.getItem('authToken');

	try {
		if (typeof accessToken === 'undefined') {
			throw new Error('accessToken is not defined');
		}
	} catch (error) {
		window.location.href = '../html/adminLogin.html';
		return;
	}

	skeleton();

	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
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

			return;
		}

		const { data } = await response.json();

		if (data.length > 0) {
			displayMovies(data);

		} else {
			Toastify({
				text: "Not comment found in database!",
				className: "error",
				gravity: "top",
				position: "center",
				duration: 1500,
				style: {
					background: "linear-gradient(to right, red, yellow)",
				}
			}).showToast();

			notDataFound();

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

function displayMovies(movies, currentPage = 1, rowsPerPage = 7) {
	const tableBody = document.querySelector('table');
	tableBody.innerHTML = '';
	tableBody.innerHTML = `
		 <thead>
			  <tr>
			  		<th>ID</th>
					<th>Img</th>
					<th class="title-head">Title</th>
					<th>Overview</th>
					<th>Category</th>
					<th>IMDB</th>
					<th class="editTable">Edit</th>
					<th class="removeTable">Remove</th>
			  </tr>
		 </thead>
	`;

	const start = (currentPage - 1) * rowsPerPage;
	const end = start + rowsPerPage;
	const paginatedMovies = movies.slice(start, end);

	const paginatedMoviesHTML = paginatedMovies.map(({ id, title, cover_url, overview, category, imdb }) => {
		return `
			  <tr>
			  		<td>${id}</td>
					<td> <img
                           class="poster"
                           src="${cover_url}"
                           alt="poster"
                        /></td>
					<td class="title-cell">
                       
                        ${title}
                     </td>
					<td>${overview.length < 30 ? overview : overview.substring(0, 29) + '...'}</td>
					<td>${category.name}</td>
					<td>${imdb}</td>
					<td class="action-icons">
						<i class="edit fas fa-edit" onclick="editMovieRow(${id})"></i>
					</td>
					<td class="action-icons">
						<i
							class="remove fas fa-trash"
							onclick="removeMovieRow(this, ${id})"
						></i>
					</td>
			  </tr>
		 `;
	}).join('');

	tableBody.innerHTML += paginatedMoviesHTML;
	setupPagination(movies, currentPage, rowsPerPage);
}

function setupPagination(movies, currentPage, rowsPerPage) {
	const paginationDiv = document.getElementById('pagination');
	paginationDiv.innerHTML = '';
	const totalPages = Math.ceil(movies.length / rowsPerPage);

	for (let i = 1; i <= totalPages; i++) {
		const pageButton = document.createElement('button');
		pageButton.innerText = i;
		pageButton.className = 'pagination-button';
		pageButton.addEventListener('click', () => displayMovies(movies, i, rowsPerPage));
		if (i === currentPage) {
			pageButton.disabled = true;
		}
		paginationDiv.appendChild(pageButton);
	}
}

const deleteMovies = async (movieId) => {
	const apiUrl = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie/${movieId}`;
	const accessToken = localStorage.getItem('authToken');


	try {
		if (typeof accessToken === 'undefined') {
			throw new Error('accessToken is not defined');
		}
	} catch (error) {
		window.location.href = '../html/adminLogin.html';
		return;
	}

	skeleton();

	try {
		const response = await fetch(apiUrl, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		});

		if (!response.ok) {
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

			return;
		}

		Toastify({
			text: `The movie with ID ${movieId} has been deleted.`,
			className: "info",
			gravity: "top",
			position: "center",
			duration: 1500,
			style: {
				background: "linear-gradient(to right, #00b09b, #96c93d)",
			}
		}).showToast()

		fetchMovies();

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

const createMovie = async () => {
	const movieTitle = document.querySelector('#modal .movieTitle');
	const movieOverview = document.querySelector('#modal .movieOverview');
	const movieCoverUrl = document.querySelector('.movieCoverImage img');
	const movieFragman = document.querySelector('#modal .movieFragman');
	const movieWatchUrl = document.querySelector('#modal .movieWatchUrl');
	const movieRunTimeMin = document.querySelector('#modal .movieRunTimeMin');
	const movieImdb = document.querySelector('#modal .movieImdb');
	const movieCategory = document.querySelector('#modal .movieCategory');
	const movieActors = document.querySelector('#modal .movieActors');
	const movieAdult = document.querySelector('#modal .movieAdult');

	let movieCreateObj = {
		title: movieTitle.value,
		cover_url: movieCoverUrl.src,
		fragman: movieFragman.value,
		watch_url: movieWatchUrl.value,
		adult: movieAdult.checked,
		run_time_min: Math.floor(Number(movieRunTimeMin.value)),
		imdb: movieImdb.value,
		category: Number(movieCategory.value),
		actors: Array.from(movieActors.selectedOptions).map(option => Number(option.value)),
		overview: movieOverview.value
	};

	const keysToSkip = ['actors', 'category', 'adult'];

	for (let key in movieCreateObj) {
		if (keysToSkip.includes(key)) {
			continue;
		} else if (!movieCreateObj[key]) {
			Toastify({
				text: "Please don't leave the inputs empty",
				className: "error",
				gravity: "top",
				position: "center",
				duration: 1500,
				style: {
					background: "maroon",
				}
			}).showToast();
			return;
		}
	}


	// Sending Post:
	const apiUrl = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie`;
	const accessToken = localStorage.getItem('authToken');


	try {
		if (typeof accessToken === 'undefined') {
			throw new Error('accessToken is not defined');
		}
	} catch (error) {
		window.location.href = '../html/adminLogin.html';
		return;
	}

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(movieCreateObj)
		});

		if (!response.ok) {
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

			return;
		}

		hideModal();

		Toastify({
			text: "New Movie Created on Database!",
			className: "info",
			gravity: "top",
			position: "center",
			duration: 1500,
			style: {
				background: "linear-gradient(to right, #00b09b, #96c93d)",
			}
		}).showToast();

		fetchMovies();

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
}

const editMovie = async (movieId) => {
	const movieTitle = document.querySelector('#modal .movieTitle');
	const movieOverview = document.querySelector('#modal .movieOverview');
	const movieCoverUrl = document.querySelector('.movieCoverImage img');
	const movieFragman = document.querySelector('#modal .movieFragman');
	const movieWatchUrl = document.querySelector('#modal .movieWatchUrl');
	const movieRunTimeMin = document.querySelector('#modal .movieRunTimeMin');
	const movieImdb = document.querySelector('#modal .movieImdb');
	const movieCategory = document.querySelector('#modal .movieCategory');
	const movieActors = document.querySelector('#modal .movieActors');
	const movieAdult = document.querySelector('#modal .movieAdult');

	let movieCreateObj = {
		title: movieTitle.value,
		cover_url: movieCoverUrl.src,
		fragman: movieFragman.value,
		watch_url: movieWatchUrl.value,
		adult: movieAdult.checked,
		run_time_min: Math.floor(Number(movieRunTimeMin.value)),
		imdb: movieImdb.value,
		category: Number(movieCategory.value),
		actors: Array.from(movieActors.selectedOptions).map(option => Number(option.value)),
		overview: movieOverview.value
	};

	const keysToSkip = ['actors', 'category', 'adult'];

	for (let key in movieCreateObj) {
		if (keysToSkip.includes(key)) {
			continue;
		} else if (!movieCreateObj[key]) {
			Toastify({
				text: "Please don't leave the inputs empty",
				className: "error",
				gravity: "top",
				position: "center",
				duration: 1500,
				style: {
					background: "maroon",
				}
			}).showToast();
			return;
		}
	}


	// Sending Post:
	const apiUrl = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie/${movieId}`;
	const accessToken = localStorage.getItem('authToken');


	try {
		if (typeof accessToken === 'undefined') {
			throw new Error('accessToken is not defined');
		}
	} catch (error) {
		window.location.href = '../html/adminLogin.html';
		return;
	}

	try {
		const response = await fetch(apiUrl, {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(movieCreateObj)
		});

		if (!response.ok) {
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

			return;
		}

		Toastify({
			text: `The movie with ID ${movieId} has been edited.`,
			className: "info",
			gravity: "top",
			position: "center",
			duration: 1500,
			style: {
				background: "linear-gradient(to right, #00b09b, #96c93d)",
			}
		}).showToast();

		hideModal(); //notification gostermeme sebebi bu funksiyadi. reload olur deye imkan vermir

		fetchMovies();

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
}
