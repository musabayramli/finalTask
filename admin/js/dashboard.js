const authToken = localStorage.getItem('authToken');

if (!authToken) {
  window.location.href = "../html/login.html";
} else {
  console.log('Token mövcuddur, admin panel açılacaq.');
}
