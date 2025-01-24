document.addEventListener('DOMContentLoaded', () => {
	fetchDatas();
});

const fetchDatas = async () => {
	const apiUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/admin/dashboard';
	const accessToken = localStorage.getItem('authToken');


	try {
		if (typeof accessToken === 'undefined') {
			throw new Error('accessToken is not defined');
		}
	} catch (error) {
		window.location.href = '../html/adminLogin.html';
		return;
	}

	// skeleton();

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
			displayDatas(data);

		} else {
			Toastify({
				text: "Data unloaded!",
				className: "error",
				gravity: "top",
				position: "center",
				duration: 1500,
				style: {
					background: "linear-gradient(to right, red, yellow)",
				}
			}).showToast()
			throw new Error('Datas not full.');
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

function displayDatas(datas) {
	console.log(datas);
	document.querySelectorAll('main div').forEach((el, ind) => {
		const span = el.querySelector('span');
		span.className = `${Object.entries(datas)[ind][0]} number-animate`;
		span.setAttribute('number-animate-increment', '1');
		span.setAttribute('number-animate-delay', '21');
		span.setAttribute('number-animate-start', '0');
		span.setAttribute('number-animate-end', `${Object.entries(datas)[ind][1]}`);
		span.innerHTML = Object.entries(datas)[ind][1];

		animateNumbers(span);
	});

}