document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
  });
  
  function fetchUsers() {
    const apiUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/admin/users';
  
    // localStorage-dan tokeni alırıq
    const token = localStorage.getItem('authToken');
    
    // Token yoxdursa, admini login səhifəsinə yönləndiririk
    if (!token) {
      window.location.href = '../html/adminLogin.html'; 
      return;
    }
  
    // API sorğusu göndəririk
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('API cavabı alınmadı');
      }
      return response.json();
    })
    .then(data => {
      // API cavabının strukturu fərqli ola bilər, onu yoxlamaq lazımdır.
      if (data && data.users) {
        displayUsers(data.users); 
      } else {
        console.error('İstifadəçi məlumatları tapılmadı');
      }
    })
    .catch(error => {
      console.error('Xəta:', error);
    });
  }
  
  function displayUsers(users) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = ''; 
    
    users.forEach(user => {
      const row = document.createElement('tr'); 
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>  <!-- Burada istifadəçi adı göstərilir -->
        <td>${user.email}</td>  <!-- E-poçt göstərə bilərsiniz -->
        <td>${user.role}</td>   <!-- İstifadəçinin rolu (Admin, User və s.) -->
      `;
      tableBody.appendChild(row); 
    });
  }
  