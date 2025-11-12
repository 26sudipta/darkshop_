function handleLogin() {
  const usernameOrEmail = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!usernameOrEmail || !password) {
    alert('Please fill in all fields');
    return;
  }

  // Get all users from localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Find user by username or email
  const user = users.find(u => 
    (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
  );

  if (user) {
    // Store current logged-in user
    localStorage.setItem('currentUser', JSON.stringify({
      username: user.username,
      email: user.email
    }));
    alert('Login successful!');
    window.location.href = 'index.html';
  } else {
    alert('Invalid username/email or password');
  }
}

// Signup logic moved to signup.js; this file now only handles login.
