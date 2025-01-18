document.addEventListener('DOMContentLoaded', () => {
	fetchUsers();
});


const fetchUsers = async () => {
	const apiUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/admin/users';

	// localStorage-dan tokeni alırıq
	const accessToken = localStorage.getItem('authToken');

	// Token yoxdursa, admini login səhifəsinə yönləndiririk
	if (!accessToken) {
		window.location.href = '../html/adminLogin.html';
		return;
	}

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
		console.log('Yanıt:', data);

		if (data && accessToken) {
			displayUsers(data);
		} else {
			throw new Error('Datas not full.');
		}
	} catch (error) {
		console.error('Hata:', error.message);
	}
};

function displayUsers(users) {
	const tableBody = document.querySelector('table tbody');
	tableBody.innerHTML = ''; // Cədvəlin əvvəlki məzmununu təmizləyirik

	users.forEach(user => {
		const row = document.createElement('tr');
		row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.full_name}</td>  <!-- Burada istifadəçi adı göstərilir -->
        <td>${user.email}</td>  <!-- E-poçt göstərə bilərsiniz -->
        <td>${new Date(user.created_at).toLocaleDateString()}</td>   <!-- İstifadəçinin rolu (Admin, User və s.) -->
      `;
		tableBody.appendChild(row); // Satırı cədvələ əlavə edirik
	});
}
