function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="container">
      <h1>Welcome, {user.name}</h1>
      <p>Your Role: <strong>{user.role}</strong></p>

      {/* ADMIN ONLY SECTION */}
      {user.role === 'Admin' && (
        <div className="admin-panel" style={{border: '2px solid red', padding: '10px'}}>
          <h3>Admin Controls</h3>
          <button>Create New Project</button>
          <button>Assign Member to Task</button>
        </div>
      )}

      {/* SECTION FOR EVERYONE */}
      <div className="task-list">
        <h3>Your Tasks</h3>
        {/* Map through tasks here */}
      </div>
    </div>
  );
}