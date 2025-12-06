import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="top-bar">
      <h2>Expense / Deposit Manager</h2>
      <div>
        <span style={{ marginRight: 12, fontSize: 14 }}>
          {user?.fullName || user?.email}
        </span>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
