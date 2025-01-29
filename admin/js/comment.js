const pageRight = document.querySelector(".page-right");

// Elave olaraq admin panelde ad ve resim gorunecek

//SHOW DETAILS MODAL #################################
function showRowDetails({ movieId, comment }) {
	const removeModal = document.querySelector("#detailsModal");
	const modalOverlay = document.querySelector(".modal-details-overlay");
	const cancelBtn = document.querySelector("#detailsModal .cancelBtn");

	removeModal.classList.add("modal-hidden");
	removeModal.style.visibility = "visible";
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
		.then(({ data }) => {
			const { title, cover_url, overview, category } = data;

			innerHTMLData = `
				<div
					style="
						background-color: #171616;
						color: white;
						border-radius: 10px;
					"
				>
					<table
						style="width: 100%; border-collapse: collapse;"
					>
						<caption style="margin-bottom: 30px">
							Comment Description<br />
							<span
								style="
									animation: colorChange 3s infinite;
									font-weight: bold;
									text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
								"
								>${comment}</span
							>
						</caption>
						<thead>
							<tr style="background-color: #2c2c2c">
								<th style="padding: 10px">Movie Cover</th>
								<th style="padding: 10px">Movie Name</th>
								<th style="padding: 10px">Category</th>
							</tr>
						</thead>
						<tbody style="background-color: #2c2c2c; color: white">
							<tr class="table-primary">
								<td style="padding: 10px; text-align: center">
									<img
										src="${cover_url}"
										style="width: 50px; height: auto"
									/>
								</td>
								<td style="padding: 10px; color: black"><b>${title}</b></td>
								<td style="padding: 10px; color: black">${category.name}</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="3" style="padding: 10px; color: black">
									${overview}
								</td>
							</tr>
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
	removeModal.style.visibility = "hidden";
	modalOverlay.style.visibility = "hidden";
	pageRight.style.backgroundColor = "#171616";
}


//SHOW REMOVE MODAL #################################
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
		if (typeof accessToken === 'undefined' || accessToken == null) {
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
			  		<th class="title-head">Movie Name</th>
					<th>Comment</th>
					<th>Created At</th>
					<th>See</th>
					<th>Delete</th>
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
			  		<td class="title-cell">${movie.title}</td>       
					<td>${comment.length < 30 ? comment : comment.substring(0, 29) + '...'}</td>
					<td>${new Date(created_at).toLocaleDateString()}</td>
					<td class="action-icons">
						 <i
							  class="fas fa-eye"
							  onclick="showRowDetails({movieId: ${movie.id}, comment: '${comment}'})" 
						 ></i>
						 
					</td> 
					<td class="action-icons">
						<i class="remove fas fa-trash"
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