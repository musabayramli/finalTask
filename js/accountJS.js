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

// -----------------------------------------------------------------------------------------
const authToken = localStorage.getItem("authToken");
const imgUrl = document.querySelector("#img_url");
const fullname = document.querySelector("#fullname");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const saveButton = document.querySelector("#savbtn"); 
const displayImg = document.querySelector("#display_img");


document.addEventListener('DOMContentLoaded', () => {
    imgUrl.addEventListener('input', function() {
        displayImg.src = this.value;
    });
});

if (!authToken) {
  console.error("Auth token is missing. Please log in.");
} else {
  fetch("https://api.sarkhanrahimli.dev/api/filmalisa/profile", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.data) {
        const profile = data.data;

        if (profile.img_url && imgUrl) imgUrl.value = profile.img_url;
        if (profile.full_name && fullname) fullname.value = profile.full_name;
        if (profile.email && email) email.value = profile.email;

        if (profile.img_url && displayImg) {
          displayImg.src = profile.img_url;
        }

      } else {
       
      }
    })
    .catch((error) => {
      
    });
}

if (!authToken) {
  console.error("Auth token is missing. Please log in.");
} else {
  saveButton.addEventListener("click", () => {
    const updatedProfile = {
      img_url: imgUrl.value,
      full_name: fullname.value,
      email: email.value,
      password: password.value,
    };

    fetch("https://api.sarkhanrahimli.dev/api/filmalisa/profile", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        
        alert("Profile updated successfully!"); 
      })
      .catch((error) => {
        
        alert("Failed to update profile. Please try again.");
      });
  });
}