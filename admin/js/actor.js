// HTML elementlərinə referanslar
const modal = document.querySelector("#modal");
const removeModal = document.querySelector("#removeModal");
const modalOverlay = document.querySelector(".modal-overlay");
const okBtn = document.querySelector(".okBtn");
const cancelBtn = document.querySelector(".cancelBtn");
const pageRight = document.querySelector(".page-right");
const paginationDiv = document.getElementById("pagination");
const messageModal = document.querySelector("#messageModal");
const messageText = document.querySelector("#messageText");
let editingActorId = null;
let actorToDelete = null;

const rowsPerPage = 5; 
let currentPage = 1; 

// Modalı göstərmək
function showModal() {
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
  modalOverlay.style.visibility = "visible";
  modalOverlay.style.opacity = "1";
  pageRight.style.backgroundColor = "#090909";
}

// Modalı gizlətmək
function hideModal() {
  modal.style.visibility = "hidden";
  modal.style.opacity = "0";
  modalOverlay.style.visibility = "hidden";
  modalOverlay.style.opacity = "0";
  pageRight.style.backgroundColor = "#171616";

  document.getElementById("actorName").value = "";
  document.getElementById("actorBio").value = "";
  document.getElementById("actorImage").value = "";
  editingActorId = null;
}

// Remove modalını göstərmək
function showRemoveModal(actorId, element) {
  actorToDelete = { id: actorId, rowElement: element.closest("tr") };
  removeModal.style.visibility = "visible";
  removeModal.style.opacity = "1";
  modalOverlay.style.visibility = "visible";
  modalOverlay.style.opacity = "1";
  pageRight.style.backgroundColor = "#090909";
}

// Remove modalını gizlətmək
function hideRemoveModal() {
  removeModal.style.visibility = "hidden";
  removeModal.style.opacity = "0";
  modalOverlay.style.visibility = "hidden";
  modalOverlay.style.opacity = "0";
  pageRight.style.backgroundColor = "#171616";
  actorToDelete = null;
}

// Mesaj Modalını göstərmək
function showMessageModal(message) {
  messageText.textContent = message; 
  messageModal.style.visibility = "visible";
  messageModal.style.opacity = "1";
}

// Mesaj Modalını gizlətmək
function hideMessageModal() {
  messageModal.style.visibility = "hidden";
  messageModal.style.opacity = "0";
}

// Cədvəldəki sətirləri göstərmək
function displayTableRows(data) {
  const tableBody = document.getElementById("actorsTable");
  tableBody.innerHTML = ""; 
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const rowsToDisplay = data.slice(startIndex, endIndex);
  rowsToDisplay.forEach((actor) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", actor.id);
    row.innerHTML = `
      <td>${actor.id}</td>
      <td>${actor.name}</td>
      <td>
        <img src="${actor.img_url}" alt="${actor.name}" width="50" height="70" style="border-radius: 5px;">
      </td>
      <td>
        <i class="edit fas fa-edit" 
           onclick="showEditModal(${actor.id}, '${actor.name}', '${actor.surname}', '${actor.img_url}')" 
           style="color: blue; font-size: 20px; cursor: pointer;" 
           title="Edit Actor"></i>
      </td>
      <td>
        <i class="remove fas fa-trash-alt" 
           onclick="showRemoveModal(${actor.id}, this)" 
           style="color: red; font-size: 20px; cursor: pointer;" 
           title="Remove Actor"></i>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Pagination düymələrini qurmaq
function setupPagination(data) {
  paginationDiv.innerHTML = ""; 
  const pageCount = Math.ceil(data.length / rowsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    if (i === currentPage) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      currentPage = i;
      displayTableRows(data);
      setupPagination(data); 
    });
    paginationDiv.appendChild(button);
  }
}

// Aktyorları API-dən yükləmə
async function loadActors() {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok && Array.isArray(data.data)) {
      data.data.sort((a, b) => a.id - b.id);
      currentPage = 1;
      displayTableRows(data.data);
      setupPagination(data.data);
    } else {
      showMessageModal("Failed to load actors.");
    }
  } catch (error) {
    console.error("Error loading actors:", error);
    showMessageModal("An error occurred while loading actors.");
  }
}

// Aktyoru yaratmaq və ya yeniləmək
async function createOrUpdateActor() {
  const actorName = document.getElementById("actorName").value.trim();
  const actorBio = document.getElementById("actorBio").value.trim();
  const actorImage = document.getElementById("actorImage").value.trim();
  const authToken = localStorage.getItem("authToken");

  if (!actorName || !actorImage) {
    showMessageModal("Please fill in all fields.");
    return;
  }

  if (!authToken) {
    showMessageModal("Authorization token is missing. Please log in again.");
    window.location.href = "login.html";
    return;
  }

  try {
    const url = editingActorId
      ? `https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor/${editingActorId}`
      : "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor";

    const method = editingActorId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: actorName,
        surname: actorBio,
        img_url: actorImage,
      }),
    });

    if (!response.ok) {
      showMessageModal(`Failed to ${editingActorId ? "update" : "create"} actor.`);
      return;
    }

    showMessageModal(`Actor ${editingActorId ? "updated" : "created"} successfully!`);
    hideModal();
    loadActors();
  } catch (error) {
    console.error("Error:", error);
    showMessageModal(`An error occurred while ${editingActorId ? "updating" : "creating"} the actor.`);
  }
}

// Aktyoru silmək
async function deleteActor() {
  const authToken = localStorage.getItem("authToken");

  if (!authToken || !actorToDelete) {
    showMessageModal("Invalid operation! Missing token or actor to delete.");
    hideRemoveModal();
    return;
  }

  try {
    const response = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor/${actorToDelete.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      actorToDelete.rowElement.remove(); 
      showMessageModal("Actor deleted successfully!");
    } else {
      showMessageModal("Failed to delete actor.");
    }
  } catch (error) {
    console.error("Error deleting actor:", error);
    showMessageModal("An error occurred while deleting the actor.");
  } finally {
    hideRemoveModal();
  }
}

// Redaktə modalını göstərmək
function showEditModal(actorId, actorName, actorBio, actorImage) {
  editingActorId = actorId;
  document.getElementById("actorName").value = actorName;
  document.getElementById("actorBio").value = actorBio;
  document.getElementById("actorImage").value = actorImage;
  showModal();
}

// Event listener-lər
cancelBtn.addEventListener("click", hideRemoveModal);
okBtn.addEventListener("click", deleteActor);

document.addEventListener("DOMContentLoaded", () => {
  loadActors();

  document.querySelector(".submit").addEventListener("click", () => {
    createOrUpdateActor();
    hideModal();
  });
});
