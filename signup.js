function handleSignup() {
  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  if (!username || !email || !password) {
    alert('Please fill in all fields');
    return;
  }

  if (!email.includes('@')) {
    alert('Please enter a valid email');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];

  const existingUser = users.find(u => u.username === username || u.email === email);
  if (existingUser) {
    alert('Username or email already exists');
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem('users', JSON.stringify(users));

  alert('Account created successfully! Please login.');
  window.location.href = 'login.html';
}
