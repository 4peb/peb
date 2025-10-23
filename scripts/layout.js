document.addEventListener("DOMContentLoaded", () => {
  const header = document.createElement("header");
  header.innerHTML = `
    <img src="/assets/logo.png" alt="Pebb Logo" class="logo" />
    <nav>
      <a href="/" id="nav-home">Home</a>
      <a href="/shop" id="nav-shop">Shop</a>
      <a href="/watch" id="nav-watch">Watch</a>
      <a href="/news" id="nav-news">News</a>
      <a href="/about" id="nav-about">About</a>
    </nav>
  `;

  const footer = document.createElement("footer");
  footer.textContent = "© 2025 Pebb. All rights reserved.";

  document.body.prepend(header);
  document.body.appendChild(footer);

  // Highlight active link
  const path = window.location.pathname.replace("/", "") || "home";
  const activeLink = document.getElementById(`nav-${path}`);
  if (activeLink) activeLink.classList.add("active");

  // Dark/light toggle
  const toggle = document.createElement("button");
  toggle.textContent = "☀️ / 🌙";
  toggle.className = "theme-toggle";
  header.appendChild(toggle);

  toggle.addEventListener("click", () => {
    const body = document.body;
    body.dataset.theme = body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", body.dataset.theme);
    updateTheme();
  });

  function updateTheme() {
    const theme = localStorage.getItem("theme") || "light";
    document.body.dataset.theme = theme;
    toggle.textContent = theme === "dark" ? "🌙" : "☀️";
  }

  updateTheme();
});
