function animateNumbers(element) {
	const start = parseInt(element.getAttribute('number-animate-start'));
	const end = parseInt(element.getAttribute('number-animate-end'));
	const increment = parseInt(element.getAttribute('number-animate-increment'));
	const delay = parseInt(element.getAttribute('number-animate-delay'));

	let current = start;
	
	const interval = setInterval(() => {
		 current += increment;
		 if (current >= end) {
			  current = end;
			  clearInterval(interval);
		 }
		 element.innerText = current;
	}, delay);
}
