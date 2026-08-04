import React from 'react'
import { useAuth } from '../../context/AuthContext'
function Dashboard() {

  const { logout } = useAuth();

  return (
    <div>
      <h1>Business Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
