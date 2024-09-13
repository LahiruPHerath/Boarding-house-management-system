import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css"; // Import the CSS file

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const navigateTo = (path) => {
    setActivePath(path);
    navigate(path);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setActivePath("/login");
    navigate("/login");
  };
  const isActive = (path) => {
    return activePath === path ? "#ecf0f1 font-bold" : "";
  };
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li>
              <Link to="/admin-dashboard/manage-boardings">
                Manage Boardings
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/manage-users">Manage Users</Link>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-3 p-3 rounded-lg text-white hover:bg-[#7b99b7] transition-colors w-full text-left ${isActive("/login")}`}
              >
                {/* <BiLogOutCircle size={24} /> */}
                <span>Sign Out</span>
              </button>
            </li>
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
