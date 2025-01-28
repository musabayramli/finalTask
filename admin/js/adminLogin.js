localStorage.clear();

// Login düyməsi üçün click hadisəsini təyin edirik
document.getElementById("loginBtn").addEventListener("click", async function (event) {
  event.preventDefault();

  // Input dəyərlərini alırıq
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageDiv = document.getElementById("message");

  // Boş input yoxlaması
  if (!email || !password) {
    messageDiv.textContent = "Please enter both email and password.";
    messageDiv.style.color = "red";
    return;
  }

  try {
    // API sorğusunu göndəririk
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/auth/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    // Serverdən gələn cavabı alırıq
    const data = await response.json();

    if (response.ok && data?.data?.tokens?.access_token) {
      // Tokeni localStorage-a saxlayırıq
      localStorage.setItem("authToken", data.data.tokens.access_token);

      // Xoş gəlmisiniz mesajı
      messageDiv.textContent = `Welcome, ${data.data.profile.full_name}!`;
      messageDiv.style.color = "green";

      // Dashboard-a yönləndirmə
      setTimeout(() => {
        window.location.href = "../html/dashboard.html";
      }, 2000);
    } else {
      // Xəta mesajı
      messageDiv.textContent = data.message || "Login failed. Please check your credentials.";
      messageDiv.style.color = "red";
      console.error("Error response:", data);
    }
  } catch (error) {
    // Şəbəkə və ya digər xətalar
    messageDiv.textContent = "An error occurred. Please try again.";
    messageDiv.style.color = "red";
    console.error("Login error:", error);
  }
});
// Şifrənin görünür/gizlənməsi funksionallığı
document.getElementById("eyesIcon").addEventListener("click", function () {
  const passwordInput = document.getElementById("password");
  const eyesIcon = document.getElementById("eyesIcon2");


  // Şifrəni görünən/görünməz etmək
  if (passwordInput.type === "password") {
    console.log(eyesIcon);
    
    passwordInput.type = "text";
    eyesIcon.src = "../icons/eyesClose.svg";
  } else {
    passwordInput.type = "password";
    eyesIcon.src = "../icons/eyes.svg";
  }
});
