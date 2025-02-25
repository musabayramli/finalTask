document.addEventListener('DOMContentLoaded', () => {
	fetchUsers();
});

async function skeleton() {
	const tableBody = document.querySelector('tbody');

	document.querySelector('thead').innerHTML = `
      <tr class="skeleton-row dark-skeleton">
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
      </tr>
      <tr class="skeleton-row">
         <td><div class="skeleton"></div></td>
         <td><div class="skeleton"></div></td>
         <td><div class="skeleton"></div></td>
         <td><div class="skeleton"></div></td>
      </tr>
   `;
}
const fetchUsers = async () => {
	const apiUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/admin/users';
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
			throw new Error(`NOT DATA! Error Status: ${response.status}`);
		}

		const { data } = await response.json();

		if (data && accessToken) {
			Toastify({
				text: "Users loaded successfully!",
				className: "info",
				gravity: "top",
				position: "center",
				duration: 1500,
				style: {
					background: "linear-gradient(to right, #00b09b, #96c93d)",
				}
			}).showToast();

			displayUsers(data);
		} else {
			Toastify({
				text: "Users unloaded!",
				className: "error",
				gravity: "top",
				position: "center",
				duration: 1500,
				style: {
					background: "linear-gradient(to right, red, yellow)",
				}
			}).showToast();
		}
	} catch (error) {
		Toastify({
			text: "Some Server Errors!",
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
function displayUsers(users, currentPage = 1, rowsPerPage = 8) {
	const tableBody = document.querySelector('table');
	tableBody.innerHTML = '';
	tableBody.innerHTML = `
		 <thead>
			  <tr>
					<th>ID</th>
					<th>Full Name</th>
					<th>Email</th>
					<th>Created</th>
			  </tr>
		 </thead>
	`;

	const row = document.createElement('tbody');
	const start = (currentPage - 1) * rowsPerPage;
	const end = start + rowsPerPage;
	const paginatedUsers = users.slice(start, end);

	paginatedUsers.forEach(user => {
		row.innerHTML += `
			  <tr>
					<td>${user.id}</td>
					<td>${user.full_name}</td>
					<td><a href="mailto:${user.email}" class="email-link">${user.email}</a></td>
					<td>${new Date(user.created_at).toLocaleDateString()}</td>
			  </tr>
		 `;
	});

	tableBody.appendChild(row);
	setupPagination(users, currentPage, rowsPerPage);
}

function setupPagination(users, currentPage, rowsPerPage) {
	const paginationDiv = document.getElementById('pagination');
	paginationDiv.innerHTML = '';
	const totalPages = Math.ceil(users.length / rowsPerPage);

	for (let i = 1; i <= totalPages; i++) {
		const pageButton = document.createElement('button');
		pageButton.innerText = i;
		pageButton.className = 'pagination-button';
		pageButton.addEventListener('click', () => displayUsers(users, i, rowsPerPage));
		if (i === currentPage) {
			pageButton.disabled = true;
		}
		paginationDiv.appendChild(pageButton);
	}
}