<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  // Replace these with YOUR Supabase URL and anon key
  const SUPABASE_URL = 'https://abc123xyz.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJI...';
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  window.supabase = supabase; // make it accessible anywhere

  // --- Signup ---
  const signupForm = document.getElementById('signup-form');
  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Error: " + error.message);
    else alert("Signup successful! Please check your email to confirm.");
    signupForm.reset();
  });

  // --- Login ---
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Error: " + error.message);
    else alert("Login successful! Welcome " + user.email);
    loginForm.reset();
  });

  // --- Logout ---
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn?.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert("Error: " + error.message);
    else alert("Logged out successfully!");
  });
</script>
