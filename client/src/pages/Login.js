const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); 
    window.location.href = '/dashboard';
  } catch (err) {
    alert("Login Failed");
  }
};