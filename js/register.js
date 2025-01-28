document
  .getElementById("loginBtn")
  .addEventListener("click", async function () {
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageDiv = document.getElementById("message");

    // Mesaj divini təmizləmək
    messageDiv.textContent = "";
    messageDiv.style.color = "";

    // Form doğrulaması
    if (!fullName || fullName.length < 3) {
      messageDiv.textContent = "Ad ən azı 3 simvoldan ibarət olmalıdır.";
      messageDiv.style.color = "red";
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      messageDiv.textContent = "Düzgün e-poçt ünvanı daxil edin.";
      messageDiv.style.color = "red";
      return;
    }

    if (!password || password.length < 8) {
      messageDiv.textContent = "Şifrə ən azı 8 simvoldan ibarət olmalıdır.";
      messageDiv.style.color = "red";
      return;
    }

    try {
      const bodyData = JSON.stringify({ full_name: fullName, email, password });
      console.log("Request Body:", bodyData);

      const response = await fetch(
        "https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        messageDiv.textContent = "Qeydiyyat uğurla tamamlandı!";
        messageDiv.style.color = "green";
        setTimeout(() => {
          window.location.href = "../pages/login.html";
        }, 2000);
      } else {
        messageDiv.textContent =
          data.message || "Qeydiyyat zamanı xəta baş verdi.";
        messageDiv.style.color = "red";
      }
    } catch (error) {
      console.error("Network error:", error);
      messageDiv.textContent =
        "Şəbəkə xətası baş verdi. Zəhmət olmasa yenidən yoxlayın.";
      messageDiv.style.color = "red";
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
