const toggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('pebb-theme');

if (currentTheme === 'dark') {
  document.body.classList.add('dark');
}

toggleBtn?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('pebb-theme', theme);
});
