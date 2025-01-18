const modal = document.querySelector("#modal");
const removeModal = document.querySelector("#removeModal");
const modalOverlay = document.querySelector(".modal-overlay");
const okBtn = document.querySelector(".okBtn");
const cancelBtn = document.querySelector(".cancelBtn");
const pageRight = document.querySelector(".page-right");
let editingActorId = null;
let actorToDelete = null;

function showModal() {
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
  modalOverlay.style.visibility = "visible";
  modalOverlay.style.opacity = "1";
  pageRight.style.backgroundColor = "#090909";
}

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

function showRemoveModal(actorId, element) {
  actorToDelete = { id: actorId, rowElement: element.closest("tr") };
  removeModal.style.visibility = "visible";
  removeModal.style.opacity = "1";
  modalOverlay.style.visibility = "visible";
  modalOverlay.style.opacity = "1";
  pageRight.style.backgroundColor = "#090909";
}

function hideRemoveModal() {
  removeModal.style.visibility = "hidden";
  removeModal.style.opacity = "0";
  modalOverlay.style.visibility = "hidden";
  modalOverlay.style.opacity = "0";
  pageRight.style.backgroundColor = "#171616";
  actorToDelete = null;
}

okBtn.addEventListener("click", async () => {
  const authToken = localStorage.getItem("authToken");

  if (!authToken || !actorToDelete) {
    alert("Invalid operation!");
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
      alert("Actor deleted successfully!");
    } else {
      alert("Failed to delete actor.");
    }
  } catch (error) {
    console.error("Error deleting actor:", error);
    alert("An error occurred while deleting the actor.");
  } finally {
    hideRemoveModal();
  }
});

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
      const tableBody = document.getElementById("actorsTable");
      tableBody.innerHTML = "";

      data.data.forEach((actor) => {
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
            <i class="remove fas fa-trash-alt" 
               onclick="showRemoveModal(${actor.id}, this)" 
               style="color: red; font-size: 20px; cursor: pointer;" 
               title="Remove Actor"></i>
          </td>
        `;
        tableBody.appendChild(row);
      });

      sortTableById();
    } else {
      alert("Failed to load actors.");
    }
  } catch (error) {
    console.error("Error loading actors:", error);
    alert("An error occurred while loading actors.");
  }
}

async function createOrUpdateActor() {
  const actorName = document.getElementById("actorName").value.trim();
  const actorBio = document.getElementById("actorBio").value.trim();
  const actorImage = document.getElementById("actorImage").value.trim();
  const authToken = localStorage.getItem("authToken");

  if (!actorName || !actorImage) {
    alert("Please fill in all fields.");
    return;
  }

  if (!authToken) {
    alert("Authorization token is missing. Please log in again.");
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
      alert(`Failed to ${editingActorId ? "update" : "create"} actor.`);
      return;
    }

    alert(`Actor ${editingActorId ? "updated" : "created"} successfully!`);
    hideModal();
    loadActors();
  } catch (error) {
    console.error("Error:", error);
    alert(`An error occurred while ${editingActorId ? "updating" : "creating"} the actor.`);
  }
}

function showEditModal(actorId, actorName, actorBio, actorImage) {
  editingActorId = actorId;
  document.getElementById("actorName").value = actorName;
  document.getElementById("actorBio").value = actorBio;
  document.getElementById("actorImage").value = actorImage;
  showModal();
}

function sortTableById() {
  const tableBody = document.getElementById("actorsTable");
  const rows = Array.from(tableBody.querySelectorAll("tr"));

  rows.sort((a, b) => parseInt(a.children[0].textContent) - parseInt(b.children[0].textContent));

  rows.forEach((row) => tableBody.appendChild(row));
}

cancelBtn.addEventListener("click", hideRemoveModal);

document.addEventListener("DOMContentLoaded", () => {
  loadActors();

  document.querySelector(".submit").addEventListener("click", () => {
    createOrUpdateActor();
    hideModal(); 
  });
});
