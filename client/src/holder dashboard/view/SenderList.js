import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SenderList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/message/holder/messages/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/holder-dashboard/chat/${userId}`);
  };

  return (
    <div>
      <h2>Your Messages</h2>
      {users.length === 0 ? (
        <p>No users have sent you messages yet.</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li
              key={index}
              style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => handleUserClick(user._id)} // Use user._id here
            >
              <img
                src={user.profilePictureUrl || "/default-profile.png"}
                alt={`${user.firstName} ${user.lastName}`}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  marginTop: "10px",
                }}
              />
              <p
                style={{
                  marginTop: "20px",
                }}
              >{`${user.firstName} ${user.lastName}`}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SenderList;
