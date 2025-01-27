document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const successMessage = document.querySelector(".success-message");
    const loadingMessage = document.querySelector(".loading-message");
    const userName = document.getElementById("userName");

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const fullName = document.getElementById("full_name").value.trim();
        const email = document.getElementById("email").value.trim();
        const reason = document.getElementById("reason").value.trim();

        if (!fullName || !email || !reason) {
            alert("Please fill in all fields.");
            return;
        }

        const formData = {
            full_name: fullName,
            email: email,
            reason: reason
        };

        try {
            // Show loading message
            loadingMessage.style.display = "block";

            const response = await fetch("https://api.sarkhanrahimli.dev/api/filmalisa/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 201) {
                const responseData = await response.json();

                // Hide loading message
                loadingMessage.style.display = "none";

                // Show success message
                successMessage.style.display = "block";
                userName.textContent = responseData.data.full_name;

                // Hide success message after 5 seconds (5000 milliseconds)
                setTimeout(function () {
                    successMessage.style.display = "none";
                }, 5000);
                
                contactForm.reset();
            } else {
                // Hide loading message
                loadingMessage.style.display = "none";
                alert("Failed to send message. Please try again later.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please check your connection and try again.");
        }
    });
});
