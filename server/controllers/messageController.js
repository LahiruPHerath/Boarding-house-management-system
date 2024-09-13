// controllers/messageController.js
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const User = require("../models/user");

const setMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const io = req.io;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Emit the message to the room
    const roomName = [senderId, receiverId].sort().join("-");
    io.to(roomName).emit("receiveMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in setMessage: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  setMessage,
  getMessages,
};

const getUsersWhoMessagedHolder = async (req, res) => {
  try {
    const holderId = req.user._id;

    const conversations = await Conversation.find({
      participants: holderId,
    }).populate("participants", "firstName lastName profilePictureUrl");

    if (!conversations.length) {
      return res.status(404).json({ message: "No users have sent messages" });
    }

    const users = [];
    conversations.forEach((conversation) => {
      conversation.participants.forEach((participant) => {
        if (participant._id.toString() !== holderId.toString()) {
          users.push({
            _id: participant._id, // Include the _id of the participant
            firstName: participant.firstName,
            lastName: participant.lastName,
            profilePictureUrl: participant.profilePictureUrl,
          });
        }
      });
    });

    const uniqueUsers = Array.from(
      new Map(users.map((user) => [user._id.toString(), user]))
    ).map(([, user]) => user);

    res.status(200).json(uniqueUsers);
  } catch (error) {
    console.log("Error in getUsersWhoMessagedHolder: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  setMessage,
  getMessages,
  getUsersWhoMessagedHolder,
};