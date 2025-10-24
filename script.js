<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = 'https://qtipmzevjvtndxctahwp.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aXBtemV2anZ0bmR4Y3RhaHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDE5MzYsImV4cCI6MjA3NjgxNzkzNn0.J9jDw7vK80s8Im41Xp43si74U3hQvFb2dDMyexcgczc';
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const username = localStorage.getItem('username');
  if (username) {
    const display = document.getElementById('usernameDisplay');
    display.textContent = username;
    display.onclick = () => window.location.href = 'profile.html';
  }
</script>
