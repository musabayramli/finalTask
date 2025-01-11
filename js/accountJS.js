const toggleIcons = document.querySelectorAll(".toggleIcon");

toggleIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;
    if (input.type === "password") {
      input.type = "text"; 
    } else {
      input.type = "password"; 
    }
  });
});