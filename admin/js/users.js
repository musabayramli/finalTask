document.addEventListener('DOMContentLoaded', () => {
   fetchUsers();
});
async function skeleton() {
   const tableBody = document.querySelector('tbody');
   document.querySelector('thead').innerHTML = `
      <tr class="skeleton-row dark-skeleton">
         <th><div class="skeleton dark"></div></th>
         <th><div class="skeleton dark"></div></th>
         <th><div class="skeleton dark"></div></th>
         <th><div class="skeleton dark"></div></th>
      </tr>
   `;
   tableBody.innerHTML += `
      <tr class="skeleton-row">
         <td><div class="skeleton"></div></td>
         <td><div class="skeleton"></div></td>
         <td><div class="skeleton"></div></td>
         <td><div class="skeleton"></div></td>
      </tr>
      <tr class="skeleton-row">
         <td><div class="skeleton"></div></td>
         <td><div class="skeleton"></div></td>
         <td><div class="skeleton"></div></td>
         <td><div class="skeleton"></div></td>
      </tr>
   `;
}
const fetchUsers = async () => {
   const apiUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/admin/users';
   const accessToken = localStorage.getItem('authToken');
   console.log(accessToken);
   try {
      if (typeof accessToken === 'undefined') {
         throw new Error('accessToken is not defined');
      }
   } catch (error) {
      window.location.href = '../html/adminLogin.html';
      return;
   }
   skeleton();
   try {
      const response = await fetch(apiUrl, {
         method: 'GET',
         headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
         }
      });
      if (!response.ok) {
         throw new Error(`NOT DATA! Error Status: ${response.status}`);
      }
      const { data } = await response.json();
      if (data && accessToken) {
         Toastify({
            text: "Users loaded successfully!",
            className: "info",
            gravity: "top",
            position: "center",
            duration: 1500,
            style: {
               background: "linear-gradient(to right, #00B09B, #96C93D)",
            }
         }).showToast();
         displayUsers(data);
      } else {
         Toastify({
            text: "Users unloaded!",
            className: "error",
            gravity: "top",
            position: "center",
            duration: 1500,
            style: {
               background: "linear-gradient(to right, red, yellow)",
            }
         }).showToast();
      }
   } catch (error) {
      Toastify({
         text: "Some Server Errors!",
         className: "error",
         gravity: "top",
         position: "center",
         duration: 1500,
         style: {
            background: "maroon",
         }
      }).showToast()
   }
};
function displayUsers(users) {
   const tableBody = document.querySelector('table');
   tableBody.innerHTML = '';
   tableBody.innerHTML = `
      <thead>
         <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Created</th>
         </tr>
      </thead>
   `;
   const row = document.createElement('tbody');
   users.forEach(user => {
      row.innerHTML += `
        <tr>
            <td>${user.id}</td>
            <td>${user.full_name}</td>
            <td>${user.email}</td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
        </tr>
      `;
      tableBody.appendChild(row);
   });
}