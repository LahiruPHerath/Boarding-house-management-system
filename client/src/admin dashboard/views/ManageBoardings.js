import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManageBoardings.css"; // Import your CSS file for styling

function ManageBoardings() {
  const [boardings, setBoardings] = useState([]);
  const navigate = useNavigate();

  // Fetch boarding houses from the server
  const fetchBoardings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/BoardingHouse/allboardings");
      setBoardings(response.data);
    } catch (error) {
      console.error("Error fetching boardings:", error);
    }
  };

  useEffect(() => {
    fetchBoardings();
  }, []);

  // Handle deletion of a boarding house
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/BoardingHouse/${id}`);
      // Remove the deleted boarding house from the state
      setBoardings(boardings.filter((boarding) => boarding._id !== id));
    } catch (error) {
      console.error("Error deleting boarding house:", error);
    }
  };

  // Navigate to the boarding details page
  const viewDetails = (id) => {
    navigate(`/boarding/${id}`);
  };

  return (
    <div className="manage-boardings">
      <h3>Manage Boardings</h3>
      <div className="boardings-list">
        {boardings.length > 0 ? (
          boardings.map((bh) => (
            <div key={bh._id} className="boarding-item">
              <div className="boarding-image">
                <img
                  src={bh.coverImage || "path/to/default/image.jpg"} // Provide a default image if none is available
                  alt={bh.name}
                />
              </div>
              <div className="boarding-details">
                <h4>{bh.name}</h4>
                <p>{bh.description}</p>
                <p>Price: Rs {bh.price} Per Month</p>
                <button onClick={() => viewDetails(bh._id)} className="view-btn">
                  View Details
                </button>
                <button onClick={() => handleDelete(bh._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No boarding houses available.</p>
        )}
      </div>
    </div>
  );
}

export default ManageBoardings;
