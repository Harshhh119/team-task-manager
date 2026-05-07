import React, { useState } from 'react';
import API from './api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Member' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert("Registration Successful! Please Login.");
      window.location.href = '/login';
    } catch (err) { alert("Registration Failed"); }
  };

  return (
    <form onSubmit={handleRegister} style={{padding: '20px'}}>
      <h2>Create Account</h2>
      <input type="text" placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} /><br/>
      <input type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} /><br/>
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} /><br/>
      <select onChange={e => setForm({...form, role: e.target.value})}>
        <option value="Member">Member</option>
        <option value="Admin">Admin</option>
      </select><br/>
      <button type="submit">Register</button>
    </form>
  );
}
export default Register;