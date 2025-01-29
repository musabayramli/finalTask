// HTML elementlərinə referanslar
const modal = document.querySelector("#modal");
const removeModal = document.querySelector("#removeModal");
const modalOverlay = document.querySelector(".modal-overlay");
const submitBtn = document.querySelector(".submit");
const okBtn = document.querySelector(".okBtn");
const cancelBtn = document.querySelector(".cancelBtn");
const tableBody = document.querySelector("tbody");
const messageModal = document.querySelector("#messageModal");
const messageText = document.querySelector("#messageText");
const paginationDiv = document.getElementById("pagination");
let editingCategoryId = null;
let categoryToDelete = null;

const apiBaseUrl = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";

const rowsPerPage = 7;
let currentPage = 1;

// Token alma funksiyası
function getAuthToken() {
  return localStorage.getItem("authToken");
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

// Modalı göstərmək
function showModal() {
  const inputElement = document.querySelector(".modal-content input");
  if (inputElement) {
    inputElement.value = "";
  }
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
  modalOverlay.style.visibility = "visible";
  modalOverlay.style.opacity = "1";
}

// Modalı gizlətmək
function hideModal() {
  modal.style.visibility = "hidden";
  modal.style.opacity = "0";
  modalOverlay.style.visibility = "hidden";
  modalOverlay.style.opacity = "0";
}

// Remove modalını göstərmək
function showRemoveModal(categoryId, element) {
  categoryToDelete = { id: categoryId, rowElement: element.closest("tr") };
  removeModal.style.visibility = "visible";
  removeModal.style.opacity = "1";
  modalOverlay.style.visibility = "visible";
  modalOverlay.style.opacity = "1";
}

// Remove modalını gizlətmək
function hideRemoveModal() {
  removeModal.style.visibility = "hidden";
  removeModal.style.opacity = "0";
  modalOverlay.style.visibility = "hidden";
  modalOverlay.style.opacity = "0";
  categoryToDelete = null;
}

// Cədvəldəki sətirləri göstərmək
function displayTableRows(data) {
  tableBody.innerHTML = "";
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const rowsToDisplay = data.slice(startIndex, endIndex);
  rowsToDisplay.forEach((category) => {
    const row = document.createElement("tr");
    row.dataset.id = category.id;
    row.innerHTML = `
      <td>${category.id}</td>
      <td>${category.name}</td>
      <td class="action-icons">
        <i class="edit fas fa-edit" onclick="showEditModal(${
          category.id
        }, '${category.name.replace(/'/g, "\\'")}')"></i>
      </td>
      <td class="action-icons">
        <i class="remove fas fa-trash" onclick="showRemoveModal(${
          category.id
        }, this)"></i>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Pagination yaratmaq
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

// Kateqoriyaları API-dən yükləmə
async function loadCategories() {
  try {
    const authToken = getAuthToken();
    if (!authToken) {
      showMessageModal("No token found. Please log in.");
      return;
    }

    const response = await fetch(`${apiBaseUrl}/categories`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories.");
    }

    const result = await response.json();
    const data = Array.isArray(result) ? result : result.data;
    data.sort((a, b) => b.id - a.id);
    currentPage = 1;
    displayTableRows(data);
    setupPagination(data);
  } catch (error) {
    console.error(error);
    showMessageModal("Error loading categories.");
  }
}

// Kateqoriya yaratmaq və ya yeniləmək
async function createOrUpdateCategory() {
  const inputElement = document.querySelector(".modal-content input");

  if (!inputElement) {
    showMessageModal("Category input element is missing.");
    return;
  }

  const categoryName = inputElement.value.trim();
  if (!categoryName) {
    showMessageModal("Please enter a valid category name.");
    return;
  }

  const authToken = getAuthToken();
  if (!authToken) {
    showMessageModal("No token found. Please log in.");
    return;
  }

  try {
    const method = editingCategoryId ? "PUT" : "POST";
    const url = editingCategoryId
      ? `${apiBaseUrl}/category/${editingCategoryId}`
      : `${apiBaseUrl}/category`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to ${editingCategoryId ? "update" : "create"} category.`
      );
    }

    const result = await response.json();

    if (editingCategoryId) {
      showMessageModal("Category updated successfully!");
    } else {
      showMessageModal("Category created successfully!");
    }

    hideModal();
    loadCategories();
    editingCategoryId = null;
  } catch (error) {
    console.error(error);
    showMessageModal("Error saving category.");
  }
}

// Kateqoriyanı silmək
async function deleteCategory() {
  const authToken = getAuthToken();
  if (!authToken) {
    showMessageModal("No token found. Please log in.");
    return;
  }

  try {
    const response = await fetch(
      `${apiBaseUrl}/category/${categoryToDelete.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete category.");
    }

    categoryToDelete.rowElement.remove();
    showMessageModal("Category deleted successfully!");
    hideRemoveModal();
  } catch (error) {
    console.error(error);
    showMessageModal("Error deleting category.");
  }
}

function showEditModal(categoryId, categoryName) {

  showModal(); 
  editingCategoryId = categoryId;
  const inputElement = document.querySelector(".modal-content input");
  console.log(inputElement)
  if (inputElement) {
    inputElement.value += categoryName ;
  }
}



// Event listener-lər
submitBtn.addEventListener("click", createOrUpdateCategory);
okBtn.addEventListener("click", deleteCategory);
cancelBtn.addEventListener("click", hideRemoveModal);
document.addEventListener("DOMContentLoaded", loadCategories);
