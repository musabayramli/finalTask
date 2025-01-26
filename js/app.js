document.addEventListener("DOMContentLoaded", () => {
	// "Sign in" düyməsini tapırıq
	const signInButton = document.querySelector(".btn");

	// Click event listener əlavə edirik
	signInButton.addEventListener("click", () => {
		// İstifadəçini login səhifəsinə yönləndiririk
		window.location.href = "../pages/login.html"; // Login səhifəsinin dəqiq yolunu buraya yazın
	});

	dropdownfaq();
});

const dropdownfaq = () => {
	// Get all FAQ items
const faqItems = document.querySelectorAll(".faq-item");

// Iterate over each FAQ item and attach a click event listener
faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const toggleBtn = item.querySelector(".toggle-btn");

    question.addEventListener("click", () => {
        // Close all other answers
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherAnswer = otherItem.querySelector(".faq-answer");
                const otherBtn = otherItem.querySelector(".toggle-btn");
                otherAnswer.style.maxHeight = "0";
                otherAnswer.style.padding = "0 20px";
                otherBtn.classList.remove("open");
            }
        });

        // Toggle the visibility of the answer
        const isOpen = answer.style.maxHeight !== "0px";
        answer.style.maxHeight = isOpen ? "0px" : answer.scrollHeight + "px";
        answer.style.padding = isOpen ? "0 20px" : "15px 20px";

        // Rotate the toggle button
        toggleBtn.classList.toggle("open");
    });

    // Ensure the initial state is set correctly
    answer.style.maxHeight = "0px";
    answer.style.padding = "0 20px";
    toggleBtn.classList.remove("open");
});

}