document.addEventListener("DOMContentLoaded", () => {
    // "Sign in" düyməsini tapırıq
    const signInButton = document.querySelector(".btn");

    // Click event listener əlavə edirik
    signInButton.addEventListener("click", () => {
        // İstifadəçini login səhifəsinə yönləndiririk
        window.location.href = "../pages/login.html"; // Login səhifəsinin dəqiq yolunu buraya yazın
    });
});
