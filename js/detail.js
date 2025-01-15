const openModal = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

openModal.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
console.log('salam');

