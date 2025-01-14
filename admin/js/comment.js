const pageRight = document.querySelector(".page-right");
const modalOverlay = document.querySelector(".modal-overlay");
const removeModal = document.querySelector("#removeModal");
const okBtn = document.querySelector(".okBtn");
const cancelBtn = document.querySelector(".cancelBtn");

//REMOVE MODAL
function removeRow(el) {
  removeModal.classList.add("modal-hidden");
  modalOverlay.style.visibility = "visible";
  pageRight.style.backgroundColor = "#090909";
  okBtn.onclick = () => {
    modalHide();
    const row = el.closest("tr");
    setTimeout(() => {
      if (row) {
        row.remove();
      }
    }, 300);
  };
  cancelBtn.onclick = () => {
    modalHide();
  };
}
// TEKRARIN QARSHISINI ALMAQ UCUN hide modal
function modalHide() {
  removeModal.classList.remove("modal-hidden");
  modalOverlay.style.visibility = "hidden";
  pageRight.style.backgroundColor = "#171616";
}

