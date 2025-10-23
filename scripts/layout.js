// -------------------------
// Pebb Layout + Auth Script
// -------------------------

// Supabase setup
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://qtipmzevjvtndxctahwp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aXBtemV2anZ0bmR4Y3RhaHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDE5MzYsImV4cCI6MjA3NjgxNzkzNn0.J9jDw7vK80s8Im41Xp43si74U3hQvFb2dDMyexcgczc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabase; // Make globally accessible

// -------------------------
// Login Functionality
// -------------------------
const loginForm = document.getElementById('login-form');
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert("Error: " + error.message);
  else {
    alert("Login successful! Welcome " + user.email);
    loginForm.reset();
    updateHeaderUser();
  }
});

// -------------------------
// Signup Functionality
// -------------------------
const signupForm = document.getElementById('signup-form');
signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) alert("Error: " + error.message);
  else {
    alert("Signup successful! Please check your email to confirm.");
    signupForm.reset();
    updateHeaderUser();
  }
});

// -------------------------
// Logout Functionality
// -------------------------
const logoutBtn = document.getElementById('logout-btn');
logoutBtn?.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) alert("Error: " + error.message);
  else {
    alert("Logged out successfully!");
    updateHeaderUser();
  }
});

// -------------------------
// Header Updates (User Display)
// -------------------------
function updateHeaderUser() {
  const user = supabase.auth.getUser ? supabase.auth.getUser().data?.user : null;
  const authButtons = document.querySelector('.auth-buttons');

  if (!authButtons) return; // Skip if no auth buttons in header

  if (user) {
    // User is logged in
    authButtons.innerHTML = `<span class="user-email">${user.email}</span>
                             <button id="logout-btn" class="btn logout-btn">Logout</button>`;
    const logoutButton = document.getElementById('logout-btn');
    logoutButton?.addEventListener('click', async () => {
      const { error } = await supabase.auth.signOut();
      if (error) alert("Error: " + error.message);
      else updateHeaderUser();
    });
  } else {
    // User not logged in, show default buttons
    authButtons.innerHTML = `<a href="/signup" class="btn signup-btn">Sign Up</a>
                             <a href="/login" class="btn login-btn">Sign In</a>`;
  }
}

// Initial header update on page load
updateHeaderUser();

// -------------------------
// Optional: Dark/Light mode toggle
// -------------------------
const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
