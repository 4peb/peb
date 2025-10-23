// layout.js — shared layout system + dark mode + animations

document.addEventListener("DOMContentLoaded", () => {
  const header = `
    <header>
      <div class="logo">
        <img src="assets/logo.png" alt="Pebb Logo" />
        <h1>Pebb</h1>
      </div>
      <nav>
        <a href="index.html">Home</a>
        <a href="shop.html">Shop</a>
        <a href="watch.html">Watch</a>
        <a href="news.html">News</a>
        <a href="about.html">About</a>
        <button id="theme-toggle" class="theme-btn">☀️</button>
      </nav>
    </header>
  `;

  const footer = `
    <footer>
      <p>© 2025 Pebb</p>
    </footer>
  `;

  // Insert header/footer
  const headerElement = document.querySelector("header");
  const footerElement = document.querySelector("footer");
  if (headerElement) headerElement.outerHTML = header;
  if (footerElement) footerElement.outerHTML = footer;

  // === DARK MODE ===
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark-mode");

  document.addEventListener("click", (e) => {
    if (e.target.id === "theme-toggle") {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      e.target.textContent = isDark ? "🌙" : "☀️";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }
  });

  // === FADE-IN EFFECT ===
  document.body.classList.add("fade-in");
});
