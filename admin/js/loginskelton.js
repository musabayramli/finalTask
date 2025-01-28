const updateAuthUI = async () => {
	const authToken = localStorage.getItem('authToken');
	const profileContainer = document.querySelector('.profile');
	const defaultProfileImg = 'https://img.freepik.com/premium-photo/blue-circle-with-man-s-head-circle-with-white-background_745528-3499.jpg';

	const skeletonHtml = `
		 <div class="skeleton-container">
			  <figure class="profile-img skeleton-circle"></figure>
			  <div class="skeleton-text"></div>
		 </div>
	`;
	profileContainer.insertAdjacentHTML('beforeend', skeletonHtml);

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


	document.querySelector('.skeleton-container').innerHTML = '';
	const newHtml = `
		 <figure class="profile-img">
			  <img src="${apiProfileImg || defaultProfileImg}" alt="${fullName || 'User'}" />
		 </figure>
		 <h2>${fullName || 'User'}</h2>
	`;
	profileContainer.innerHTML += newHtml;

	const profileImgElement = document.querySelector('.profile-img img');
	const profileNameElement = document.querySelector('.profile h2');

	profileImgElement.classList.remove('skeleton-circle');
	profileNameElement.classList.remove('skeleton-text');
};

const style = document.createElement('style');
style.textContent = `
	header .profile .skeleton-container {
		display: flex;
		align-items: center;
		gap: 10px; 
	}

	header .profile .skeleton-circle {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(44, 62, 80, 0.85); 
		position: relative;
		overflow: hidden;
	}

	header .profile .skeleton-text {
		width: 100px;
		height: 20px;
		background: rgba(44, 62, 80, 0.85); 
		position: relative;
		overflow: hidden;
	}

	header .profile .skeleton-circle::after,
	header .profile .skeleton-text::after {
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0),
			rgba(255, 255, 255, 0.4), 
			rgba(255, 255, 255, 0)
		);
		animation: darkShimmer 1.8s infinite;
	}

	@keyframes darkShimmer {
		0% {
			transform: translateX(-100%);
			opacity: 0.6;
		}
		50% {
			transform: translateX(100%);
			opacity: 0.8;
		}
		100% {
			transform: translateX(-100%);
			opacity: 0.6;
		}
	}

`;

document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', updateAuthUI);
