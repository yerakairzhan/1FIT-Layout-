const nav = document.getElementById("nav-links");
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  if (user) {
    nav.innerHTML = `
      <li><a href="catalog.html">Каталог</a></li>
      <li><a href="profile.html">Профиль (${user.login})</a></li>
      <li><a href="#" onclick="logout()">Выйти</a></li>
    `;
  } else {
    nav.innerHTML = `
      <li><a href="index.html">Главная</a></li>
      <li><a href="catalog.html">Каталог</a></li>
      <li><a href="login.html">Войти</a></li>
      <li><a href="register.html">Регистрация</a></li>
    `;
  }

  function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
  }