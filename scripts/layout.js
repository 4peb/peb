// layout.js — shared layout system for Pebb

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
      </nav>
    </header>
  `;

  const footer = `
    <footer>
      <p>© 2025 Pebb</p>
    </footer>
  `;

  // Insert header + footer if <header> or <footer> tags exist
  const headerElement = document.querySelector("header");
  const footerElement = document.querySelector("footer");

  if (headerElement) headerElement.outerHTML = header;
  if (footerElement) footerElement.outerHTML = footer;
});
