const pageRight = document.querySelector(".page-right");



//SHOW DETAILS MODAL #################################
function showRowDetails({movieId}) {
	const removeModal = document.querySelector("#detailsModal");
	const modalOverlay = document.querySelector(".modal-details-overlay");
	const cancelBtn = document.querySelector("#detailsModal .cancelBtn");

	removeModal.classList.add("modal-hidden");
	modalOverlay.style.visibility = "visible";
	pageRight.style.backgroundColor = "#090909";


	let innerHTMLData = "";
	fetch(`https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/${movieId}`, {
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
	.then(({data}) => {
		const { title, cover_url, overview, category } = data;

		innerHTMLData = `
		<div class="table-responsive-md">
			<table class="table table-striped-columns table-hover table-borderless table-primary align-middle">
				<thead>
					<caption>
						Comment Description
					</caption>
	
					<tr>
						<th>Movie Name</th>
						<th>Category</th>
						<th>Cover Url</th>
						<th>Overview</th>
					</tr>
				</thead>
				<tbody class="table-group-divider">
					<tr
						class="table-primary"
					>
						<td scope="row">${title}</td>
						<td>${category.name}</td>
						<td><img src="${cover_url}" /></td>
						<td>${overview.slice(0,20)}</td>
					</tr>
				</tbody>
				<tfoot>
					
				</tfoot>
			</table>
		</div>
		`;

		removeModal.querySelector('div:first-child').innerHTML = innerHTMLData;
	})
	.catch(error => {
		console.error('Fetch error:', error);
	});


	cancelBtn.onclick = () => {
		modalDetailsHide();
	};
}
//HIDE DETAILS MODAL
function modalDetailsHide() {
	const removeModal = document.querySelector("#detailsModal");
	const modalOverlay = document.querySelector(".modal-details-overlay");

	removeModal.classList.remove("modal-hidden");
	modalOverlay.style.visibility = "hidden";
	pageRight.style.backgroundColor = "#171616";
}


//REMOVE MODAL #################################
function removeRow(el, obj) {
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
				deleteComments(obj);
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
	const tableBody = document.querySelector('tbody');

	document.querySelector('thead').innerHTML = `
		<tr class="skeleton-row dark-skeleton">
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
			<th><div class="skeleton dark"></div></th>
		</tr>
	`;
	tableBody.innerHTML += `
		<tr class="skeleton-row">
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
	const tableBody = document.querySelector('tbody');

	document.querySelector('thead').innerHTML = `
		<tr class="skeleton-row dark-skeleton">
			<th>N/A</th>
			<th>N/A</th>
			<th>N/A</th>
			<th>N/A</th>
			<th>N/A</th>
			<th>N/A</th>
		</tr>
	`;
	tableBody.innerHTML = `
		<tr class="skeleton-row">
			<td colspan="6">Not Comments Found in Database</td>
		</tr>
	`;
}

const fetchComments = async () => {
	const apiUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments';
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
			Toastify({
				text: "Comments loaded successfully!",
				className: "info",
				gravity: "top",
				position: "center",
				duration: 1500,
				style: {
					background: "linear-gradient(to right, #00b09b, #96c93d)",
				}
			}).showToast();

			displayComments(data);

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

function displayComments(comments, currentPage = 1, rowsPerPage = 5) {
	const tableBody = document.querySelector('table');
	tableBody.innerHTML = '';
	tableBody.innerHTML = `
		 <thead>
			  <tr>
					<th class="title-head">Comment</th>
					<th>Movie</th>
					<th>Created At</th>
					<th>Operate</th>
			  </tr>
		 </thead>
	`;

	const row = document.createElement('tbody');
	const start = (currentPage - 1) * rowsPerPage;
	const end = start + rowsPerPage;
	const paginatedComments = comments.slice(start, end);

	paginatedComments.forEach(({ comment, movie, created_at, id }) => {
		 row.innerHTML += `
			  <tr>
					<td class="title-cell">${comment}</td>
					<td>${movie.title}</td>
					<td>${new Date(created_at).toLocaleDateString()}</td>
					<td class="action-icons">
						 <i
							  class="fas fa-eye"
							  onclick="showRowDetails({movieId: ${movie.id}})"
						 ></i>
						 <i
							  class="remove fas fa-trash"
							  onclick="removeRow(this, {id:${id}, movieId:${movie.id}})"
						 ></i>
					</td> 
			  </tr>
		 `;
	});

	tableBody.appendChild(row);
	setupPagination(comments, currentPage, rowsPerPage);
}

function setupPagination(comments, currentPage, rowsPerPage) {
	const paginationDiv = document.getElementById('pagination');
	paginationDiv.innerHTML = '';
	const totalPages = Math.ceil(comments.length / rowsPerPage);

	for (let i = 1; i <= totalPages; i++) {
		 const pageButton = document.createElement('button');
		 pageButton.innerText = i;
		 pageButton.className = 'pagination-button';
		 pageButton.addEventListener('click', () => displayComments(comments, i, rowsPerPage));
		 if (i === currentPage) {
			  pageButton.disabled = true;
		 }
		 paginationDiv.appendChild(pageButton);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	fetchComments();
});

const deleteComments = async ({ id, movieId }) => {
	const apiUrl = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/${movieId}/comment/${id}`;
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

		fetchComments();
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