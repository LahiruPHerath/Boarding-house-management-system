import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageUsers.css"; // Import your CSS file for styling

function ManageUsers() {
  const [users, setUsers] = useState([]);

  // Fetch users from the server
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle deletion of a user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      // Remove the deleted user from the state
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="manage-users">
      <h3>Manage Users</h3>
      {users.length > 0 ? (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user._id} className="user-item">
              <div className="user-info">
                <img
                  src={user.profilePictureUrl || "path/to/default/avatar.jpg"} // Default profile picture if none is available
                  alt={`${user.firstName} ${user.lastName}`}
                  className="profile-picture"
                />
                <div className="user-details">
                  <span>{user.firstName} {user.lastName}</span>
                  <span>Email: {user.email}</span>
                  <span>Role: {user.role}</span>
                  <span>Address: {user.address || "N/A"}</span>
                  <span>Contact: {user.contactNumber || "N/A"}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(user._id)} className="delete1-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users available.</p>
      )}
    </div>
  );
}

export default ManageUsers;
