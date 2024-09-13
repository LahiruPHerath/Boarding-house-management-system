import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import '../../styles/Chat.css';

const socket = io("http://localhost:5000");

const Chat = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverName, setReceiverName] = useState("");
  
  const userId = localStorage.getItem("userId"); // Replace with actual user ID logic
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!receiverId) {
      console.error("receiverId is undefined. Check the route and params.");
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/message/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const fetchReceiverDetails = async () => {
      try {
        const response = await axios.get(`/api/user/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.firstName && response.data.lastName) {
          const { firstName, lastName } = response.data;
          setReceiverName(`${firstName} ${lastName}`);
        } else {
          console.warn("Unexpected response format for user details");
        }
      } catch (error) {
        console.error("Error fetching receiver details:", error);
      }
    };

    fetchMessages();
    fetchReceiverDetails();

    socket.emit("joinRoom", { senderId: userId, receiverId });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [receiverId, userId, token]);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        `/api/message/send/${receiverId}`,
        { message: newMessage, senderId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      socket.emit("sendMessage", response.data);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (message) => {
    return message.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate('/holder-dashboard/message-list')}>
          ←
        </button>
        <h2>Chat with {receiverName || "User"}</h2>
      </div>
      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${msg.senderId === userId ? "sent" : "received"}`}
          >
            {formatMessage(msg.message)}
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;
