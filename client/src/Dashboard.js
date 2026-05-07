import React from 'react';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div style={{padding: '20px'}}>
      <h1>Team Dashboard</h1>
      <p>Welcome, <b>{user.name}</b>! Role: <b>{user.role}</b></p>
      
      {user.role === 'Admin' ? (
        <div style={{ border: '2px solid blue', padding: '15px', marginTop: '20px' }}>
          <h3>Admin Functions</h3>
          <button onClick={() => alert("Project Created")}>Create New Project</button>
          <button>Assign Tasks</button>
        </div>
      ) : (
        <div style={{ border: '2px solid green', padding: '15px', marginTop: '20px' }}>
          <h3>Member View</h3>
          <p>You can view and update your assigned tasks here.</p>
        </div>
      )}
      <br/>
      <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Logout</button>
    </div>
  );
}
export default Dashboard;