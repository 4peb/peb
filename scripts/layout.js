// /scripts/layout.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- Supabase config (you already gave these) ---
const SUPABASE_URL = 'https://qtipmzevjvtndxctahwp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aXBtemV2anZ0bmR4Y3RhaHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDE5MzYsImV4cCI6MjA3NjgxNzkzNn0.J9jDw7vK80s8Im41Xp43si74U3hQvFb2dDMyexcgczc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabase;

// --- Build header and footer (so all pages look the same) ---
function buildHeaderFooter() {
  // Create header if not present
  if (!document.querySelector('header')) {
    const header = document.createElement('header');
    header.innerHTML = `
      <img src="/assets/logo.png" class="logo" alt="Pebb Logo" />
      <nav>
        <a href="/" id="nav-home">Home</a>
        <a href="/shop" id="nav-shop">Shop</a>
        <a href="/news" id="nav-news">News</a>
        <a href="/watch" id="nav-watch">Watch</a>
        <a href="/about" id="nav-about">About</a>
      </nav>
      <div class="auth-buttons">
        <button class="theme-toggle" id="theme-toggle" title="Toggle theme">☀️</button>
        <div id="auth-area">
          <a href="/signup" class="btn signup-btn">Sign Up</a>
          <a href="/login" class="btn login-btn">Sign In</a>
        </div>
      </div>
    `;
    document.body.prepend(header);
  }

  // Create footer if not present
  if (!document.querySelector('footer')) {
    const footer = document.createElement('footer');
    footer.textContent = '© 2025 Pebb';
    document.body.appendChild(footer);
  }

  // Highlight active nav
  const path = window.location.pathname.replace(/^\//,'') || 'index.html';
  const mapping = {
    '': 'nav-home',
    'index.html': 'nav-home',
    'shop': 'nav-shop',
    'shop.html': 'nav-shop',
    'news': 'nav-news',
    'news.html': 'nav-news',
    'watch': 'nav-watch',
    'watch.html': 'nav-watch',
    'about': 'nav-about',
    'about.html': 'nav-about'
  };
  const activeId = mapping[path];
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) el.classList.add('active');
  }
}

buildHeaderFooter();

// --- THEME (dark/light) ---
function initTheme() {
  const body = document.body;
  const saved = localStorage.getItem('pebb-theme') || 'dark';
  if (saved === 'light') body.classList.add('light-mode'); // style defined in CSS? we used only variables in CSS; leave for expansion
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = saved === 'light' ? '🌙' : '☀️';
  btn.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-mode');
    localStorage.setItem('pebb-theme', isLight ? 'light' : 'dark');
    btn.textContent = isLight ? '🌙' : '☀️';
  });
}
initTheme();

// --- AUTH UI & logic ---
async function updateAuthArea() {
  const authArea = document.getElementById('auth-area');
  if (!authArea) return;

  // get current session user
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // fetch username from profiles table
    let username = null;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, banned')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        username = profile.username;
        if (profile.banned) {
          // If banned, you could sign out or show message. For now just show text.
          authArea.innerHTML = `<span style="color:#ff7b7b;font-weight:700">BANNED</span>`;
          return;
        }
      }
    } catch (e) {
      console.warn('Profile fetch error', e);
    }

    // show username (clickable) + logout button
    authArea.innerHTML = `
      <a href="/profile" class="user-link" id="user-link">@${username || user.email.split('@')[0]}</a>
      <button id="logout-btn" class="btn logout-btn">Logout</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', async () => {
      await supabase.auth.signOut();
      localStorage.removeItem('pebb-username');
      updateAuthArea();
      window.location.reload();
    });
  } else {
    authArea.innerHTML = `
      <a href="/signup" class="btn signup-btn">Sign Up</a>
      <a href="/login" class="btn login-btn">Sign In</a>
    `;
  }
}
updateAuthArea();

// --- Attach handlers for forms if present (signup / login) ---
function attachAuthForms() {
  // SIGNUP form: #signup-form with inputs: #username, #email, #password
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = (document.getElementById('username')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();
      const password = (document.getElementById('password')?.value || '');

      // validate username
      const re = /^[A-Za-z0-9_]+$/;
      if (!re.test(username)) {
        alert('Username may only contain letters, numbers and underscores.');
        return;
      }

      // check username uniqueness
      const { data: existing } = await supabase.from('profiles').select('id').eq('username', username).maybeSingle();
      if (existing) {
        alert('Username already taken, choose another.');
        return;
      }

      // create user
      const { data: signData, error: signErr } = await supabase.auth.signUp({ email, password });
      if (signErr) {
        alert('Signup error: ' + signErr.message);
        return;
      }

      // get user id (may require fetching)
      let userId = signData?.user?.id;
      if (!userId) {
        const { data: uData } = await supabase.auth.getUser();
        userId = uData?.user?.id;
      }
      if (!userId) {
        alert('Signed up but could not find user id. Check your email to confirm and then log in.');
        return;
      }

      // insert profile
      const { error: insertErr } = await supabase.from('profiles').insert([{ id: userId, username }]);
      if (insertErr) {
        alert('Profile save error: ' + insertErr.message);
        return;
      }

      // store username locally for quick display
      localStorage.setItem('pebb-username', username);
      alert('Account created! Please check your email for confirmation if required.');
      updateAuthArea();
      window.location.href = '/login';
    });
  }

  // LOGIN form: #login-form with inputs: #email, #password
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (document.getElementById('email')?.value || '').trim();
      const password = (document.getElementById('password')?.value || '');

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert('Login error: ' + error.message);
        return;
      }

      // fetch username for this user
      const userId = data?.user?.id;
      if (userId) {
        const { data: profile } = await supabase.from('profiles').select('username').eq('id', userId).maybeSingle();
        const username = profile?.username;
        if (username) localStorage.setItem('pebb-username', username);
      }

      updateAuthArea();
      window.location.href = '/';
    });
  }
}
attachAuthForms();

// react to auth state changes (so header updates if user logs in/out in other tabs)
supabase.auth.onAuthStateChange((event, session) => {
  updateAuthArea();
});
