document
  .getElementById("loginBtn")
  .addEventListener("click", async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const passwordInput = document.getElementById("password");
    const messageDiv = document.getElementById("message");

    // Form validation
    if (!email || !password) {
      messageDiv.textContent = "Email və şifrə daxil edin.";
      messageDiv.style.color = "red";
      return;
    }

    try {
      // API request
      const response = await fetch(
        "https://api.sarkhanrahimli.dev/api/filmalisa/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Check if the response contains tokens and save to localStorage
        if (data.data && data.data.tokens && data.data.tokens.access_token) {
          const token = data.data.tokens.access_token;
          localStorage.setItem("authToken", token);

          // Display success message and redirect
          messageDiv.textContent = "Giriş uğurludur. Yenidən yönləndirilir...";
          messageDiv.style.color = "green";
          setTimeout(() => {
            window.location.href = "../pages/home.htm";
          }, 2000);
        } else {
          messageDiv.textContent = "Giriş zamanı token alınmadı.";
          messageDiv.style.color = "red";
        }
      } else {
        // Display error message from server
        messageDiv.textContent = data.message || "Giriş zamanı səhv baş verdi.";
        messageDiv.style.color = "red";
      }
    } catch (error) {
      // Handle network or unexpected errors
      messageDiv.textContent =
        "Şəbəkə xətası baş verdi. Zəhmət olmasa yenidən yoxlayın.";
      messageDiv.style.color = "red";
      console.error("Error:", error);
    }
  });

// Şifrənin görünür/gizlənməsi funksionallığı
document.getElementById("eyesIcon").addEventListener("click", function () {
  const passwordInput = document.getElementById("password");
  const eyesIcon = document.getElementById("eyesIcon");

  // Şifrəni görünən/görünməz etmək
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyesIcon.src = "../admin/icons/eyesClose.svg";
  } else {
    passwordInput.type = "password";
    eyesIcon.src = "../admin/icons/eyes.svg";
  }
});
