const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const toggleBtn = item.querySelector(".toggle-btn");

    question.addEventListener("click", () => {
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.querySelector(".faq-answer").style.display = "none";
                otherItem.querySelector(".toggle-btn").classList.remove("open");
            }
        });

        const isOpen = answer.style.display === "block";
        answer.style.display = isOpen ? "none" : "block";
        toggleBtn.classList.toggle("open", !isOpen);
    });
});
