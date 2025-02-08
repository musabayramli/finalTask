const updateAuthUI = async () => {
	const authToken = localStorage.getItem('authToken');
	const inputBar = document.querySelector('.inp-bar');
	const defaultProfileImg = 'https://img.freepik.com/premium-photo/blue-circle-with-man-s-head-circle-with-white-background_745528-3499.jpg';

	const skeletonHtml = `
		 <div class="skeleton-container">
			  <figure class="skeleton-circle"></figure>
			  <div class="skeleton-text"></div>
		 </div>
	`;
	inputBar.innerHTML = '';
	inputBar.innerHTML = skeletonHtml;

	let apiProfileImg = '';
	let fullName = '';

	if (authToken) {
		try {
			const response = await fetch('https://api.sarkhanrahimli.dev/api/filmalisa/profile', {
				headers: {
					'Authorization': `Bearer ${authToken}`
				}
			});
			const data = await response.json();
			if (data.result && data.data.full_name) {
				fullName = data.data.full_name;
				apiProfileImg = data.data.img_url || '';
			}
		} catch (error) {
			console.error('API error:', error);
		}
	}


	const newHtml = `
		<img src="${apiProfileImg || defaultProfileImg}" alt="${fullName || 'User'}" class="inp-img" />
		<input type="text" placeholder="${fullName || 'User'}'s comment...">
	`;
	inputBar.innerHTML = newHtml;

};
