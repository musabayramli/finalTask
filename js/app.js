document.addEventListener("DOMContentLoaded", () => {
	const signInButton = document.querySelector(".btn");

	signInButton.addEventListener("click", () => {
		window.location.href = "../pages/login.html"; // Login səhifəsinin dəqiq yolunu buraya yazın
	});

	dropdownfaq();
	updateAuthUI();
});

const dropdownfaq = () => {
	const faqItems = document.querySelectorAll(".faq-item");

	faqItems.forEach(item => {
		const question = item.querySelector(".faq-question");
		const answer = item.querySelector(".faq-answer");
		const toggleBtn = item.querySelector(".toggle-btn");

		question.addEventListener("click", () => {
			faqItems.forEach(otherItem => {
				if (otherItem !== item) {
					const otherAnswer = otherItem.querySelector(".faq-answer");
					const otherBtn = otherItem.querySelector(".toggle-btn");
					otherAnswer.style.maxHeight = "0";
					otherAnswer.style.padding = "0 20px";
					otherBtn.classList.remove("open");
				}
			});

			const isOpen = answer.style.maxHeight !== "0px";
			answer.style.maxHeight = isOpen ? "0px" : answer.scrollHeight + "px";
			answer.style.padding = isOpen ? "0 20px" : "15px 20px";

			toggleBtn.classList.toggle("open");
		});

		answer.style.maxHeight = "0px";
		answer.style.padding = "0 20px";
		toggleBtn.classList.remove("open");
	});
}

const updateAuthUI = async () => {
	const authToken = localStorage.getItem('authToken');
	const signInButton = document.querySelector('.btn');
	const profileContainer = document.querySelector('.profile-container');
	const profileImg = document.createElement('img');
	const dropdownMenu = document.createElement('div');
	const goToMoviesButton = document.createElement('button');
	const defaultProfileImg = 'https://img.freepik.com/premium-photo/blue-circle-with-man-s-head-circle-with-white-background_745528-3499.jpg';

	let apiProfileImg = '';
	let fullName = '';

	// Skeleton show
	const showSkeleton = () => {
		const skeletonText = document.createElement('div');
		skeletonText.classList.add('skeleton', 'skeleton-text');
		const skeletonCircle = document.createElement('div');
		skeletonCircle.classList.add('skeleton', 'skeleton-circle');
		profileContainer.appendChild(skeletonText);
		profileContainer.appendChild(skeletonCircle);
		return { skeletonText, skeletonCircle };
	};

	// Skeleton hide
	const hideSkeleton = (skeletonElements) => {
		profileContainer.removeChild(skeletonElements.skeletonText);
		profileContainer.removeChild(skeletonElements.skeletonCircle);
	};

	// Show skeleton elements:
	const skeletonElements = showSkeleton();

	if (authToken) {
		try {
			const response = await fetch('https://api.sarkhanrahimli.dev/api/filmalisa/profile', {
				headers: {
					'Authorization': `Bearer ${authToken}`
				}
			});

			const data = await response.json();
			if (data.result && data.data.img_url && data.data.full_name) {
				apiProfileImg = data.data.img_url;
				fullName = data.data.full_name;
			}
		} catch (error) {
			console.error('API error:', error);
		}
	}

	profileImg.src = apiProfileImg || defaultProfileImg;
	profileImg.alt = 'Profile';
	profileImg.className = 'profile-img';

	dropdownMenu.className = 'dropdown';
	dropdownMenu.style.display = 'none';

	const settingsLink = document.createElement('a');
	settingsLink.href = '#';
	settingsLink.id = 'settings';
	settingsLink.innerHTML = '<i class="fas fa-cog icon"></i> Settings';

	const logoutLink = document.createElement('a');
	logoutLink.href = '#';
	logoutLink.id = 'logout';
	logoutLink.innerHTML = '<i class="fas fa-sign-out-alt icon"></i> Logout';

	dropdownMenu.appendChild(settingsLink);
	dropdownMenu.appendChild(logoutLink);

	goToMoviesButton.className = 'go-to-movies';
	goToMoviesButton.textContent = 'Go to movies';

	const greeting = document.createElement('span');
	greeting.textContent = `Hi, ${fullName || "User"}`;
	greeting.style.fontSize = '17px';
	greeting.style.fontWeight = 'bolder';
	greeting.style.marginLeft = '10px';
	greeting.style.color = '#fff';

	if (authToken) {
		hideSkeleton(skeletonElements);
		profileContainer.style.display = 'flex';
		profileContainer.appendChild(goToMoviesButton);
		profileContainer.appendChild(greeting);
		profileContainer.appendChild(profileImg);
		profileContainer.appendChild(dropdownMenu);
	} else {
		signInButton.style.display = 'block';
		profileContainer.style.display = 'none';
	}

	profileImg.addEventListener('click', (e) => {
		e.stopPropagation();
		dropdownMenu.style.top = `${profileImg.offsetHeight}px`;
		dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
	});

	document.addEventListener('click', () => {
		dropdownMenu.style.display = 'none';
	});

	dropdownMenu.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	goToMoviesButton.addEventListener('click', () => {
		window.location.href = './pages/home.htm';
	});

	goToMoviesButton.style.cursor = 'pointer';

	document.getElementById('logout').addEventListener('click', () => {
		localStorage.removeItem('authToken');
		location.reload();
	});

	document.getElementById('settings').addEventListener('click', () => {
		if (authToken) {
			window.location.href = './pages/account.htm';
		}
	});
}