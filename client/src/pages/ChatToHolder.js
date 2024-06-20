import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatToHolder = () => {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = "currentUserId"; // Replace with the actual user ID logic
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch messages
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

    fetchMessages();

    // Join the chat room
    socket.emit("joinRoom", { senderId: userId, receiverId });

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [receiverId, userId, token]);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        `/api/message/send/${receiverId}`,
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Emit the message via socket
      socket.emit("sendMessage", response.data);

      // Optimistically update the message list
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h2>Chat with Holder</h2>
      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${msg.senderId === userId ? "sent" : "received"}`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatToHolder;
