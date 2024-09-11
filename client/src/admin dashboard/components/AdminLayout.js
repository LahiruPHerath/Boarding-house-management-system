import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./AdminLayout.css"; // Import the CSS file

function AdminLayout() {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/admin-dashboard/manage-boardings">Manage Boardings</Link></li>
            <li><Link to="/admin-dashboard/manage-users">Manage Users</Link></li>
            <li><Link to="/admin-dashboard/manage-reviews">Manage Reviews</Link></li>
          </ul>
          {/* <h4>Logout</h4> */}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
