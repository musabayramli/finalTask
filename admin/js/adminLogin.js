document
  .getElementById("loginBtn")
  .addEventListener("click", async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageDiv = document.getElementById("message");

    if (!email || !password) {
        messageDiv.textContent = "Please enter both email and password.";
        messageDiv.style.color = "red";
    }
    try {
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
      const data = await response.json();
      if (response.ok) {
        messageDiv.textContent = `Welcome, ${data.data.profile.full_name}!`;
        messageDiv.style.color = "green";
        setTimeout(() => {
          window.location.href = "../html/dashboard.html";
        }, 5000);
      } else {
        messageDiv.textContent = data.message || "Login failed.";
        messageDiv.style.color = "red";
      }
    } catch (error) {
      messageDiv.textContent = "An error occurred. Please try again.";
      messageDiv.style.color = "red";
    }
  });

  const inputPassword=document.getElementById("password")
  const eyesIcon=document.getElementById("eyesIcon")

  eyesIcon.addEventListener("click",()=>{
    const visiblePass=inputPassword.type=="text"
    inputPassword.type=visiblePass ? "password" : "text"

    eyesIcon.src=visiblePass ? "../icons/eyes.svg" : "../icons/eyesClose.svg"
  })