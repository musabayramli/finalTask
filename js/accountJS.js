const toggleIcons = document.querySelectorAll(".toggleIcon");

toggleIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    // İkona ait olan input'u bul
    const input = icon.previousElementSibling; // İkona yakın olan input
    if (input.type === "password") {
      input.type = "text"; // Şifreyi görünür yap
    } else {
      input.type = "password"; // Şifreyi gizle
    }
  });
});