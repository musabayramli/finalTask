const pageRight = document.querySelector(".page-right");


//SHOW DETAILS MODAL #################################
function showRowDetails(el) {
	const removeModal = document.querySelector("#detailsModal");
	const modalOverlay = document.querySelector(".modal-details-overlay");
	const cancelBtn = document.querySelector("#detailsModal .cancelBtn");
	const elDesc = el.closest("tr").querySelector('td:nth-child(4)').textContent;

	removeModal.classList.add("modal-hidden");
	modalOverlay.style.visibility = "visible";
	pageRight.style.backgroundColor = "#090909";
	removeModal.querySelector('p').innerHTML = elDesc;

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
function removeRow(el) {
	const removeModal = document.querySelector("#removeModal");
	const modalOverlay = document.querySelector(".modal-remove-overlay");
	const cancelBtn = document.querySelector("#removeModal .cancelBtn");
	const okBtn = document.querySelector("#removeModal .okBtn");
	const elId = el.closest("tr").querySelector('td:first-child').textContent;

	removeModal.classList.add("modal-hidden");
	modalOverlay.style.visibility = "visible";
	pageRight.style.backgroundColor = "#090909";
	okBtn.onclick = () => {
		modalHide();
		const row = el.closest("tr");
		setTimeout(() => {
			if (row) {
				row.remove();
				deleteContacts(elId);
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
			<td colspan="6">Not Contact Found in Database</td>
		</tr>
	`;
}

const fetchContacts = async () => {
	const apiUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/admin/contacts';
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
				text: "Contact loaded successfully!",
				className: "info",
				gravity: "top",
				position: "center",
				duration: 1500,
				style: {
					background: "linear-gradient(to right, #00b09b, #96c93d)",
				}
			}).showToast();

			displayContacts(data);

		} else {
			Toastify({
				text: "Not contact found in database!",
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

function displayContacts(contacts, currentPage = 1, rowsPerPage = 5) {
	const tableBody = document.querySelector('table');
	tableBody.innerHTML = '';
	tableBody.innerHTML = `
		 <thead>
			  <tr>
					<th>ID</th>
					<th class="title-head">Title</th>
					<th>Email</th>
					<th>Reason</th>
					<th>Created</th>
					<th>Operate</th>
			  </tr>
		 </thead>
	`;

	const row = document.createElement('tbody');
	const start = (currentPage - 1) * rowsPerPage;
	const end = start + rowsPerPage;
	const paginatedContacts = contacts.slice(start, end);

	paginatedContacts.forEach(contact => {
		row.innerHTML += `
			  <tr>
					<td>${contact.id}</td>
					<td class="title-cell">${contact.full_name}</td>
					<td>${contact.email}</td>
					<td>${contact.reason}</td>
					<td>${new Date(contact.created_at).toLocaleDateString()}</td>
					<td class="action-icons">
						 <i
							  class="fas fa-eye"
							  onclick="showRowDetails(this)"
						 ></i>
						 <i
							  class="remove fas fa-trash"
							  onclick="removeRow(this)"
						 ></i>
					</td> 
			  </tr>
		 `;
	});

	tableBody.appendChild(row);
	setupPagination(contacts, currentPage, rowsPerPage);
}

function setupPagination(contacts, currentPage, rowsPerPage) {
	const paginationDiv = document.getElementById('pagination');
	paginationDiv.innerHTML = '';
	const totalPages = Math.ceil(contacts.length / rowsPerPage);

	for (let i = 1; i <= totalPages; i++) {
		const pageButton = document.createElement('button');
		pageButton.innerText = i;
		pageButton.className = 'pagination-button';
		pageButton.addEventListener('click', () => displayContacts(contacts, i, rowsPerPage));
		if (i === currentPage) {
			pageButton.disabled = true;
		}
		paginationDiv.appendChild(pageButton);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	fetchContacts();
});

const deleteContacts = async (id) => {
	const apiUrl = `https://api.sarkhanrahimli.dev/api/filmalisa/admin/contact/${id}`;
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

		fetchContacts();
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