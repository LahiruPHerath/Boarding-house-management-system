// routes/messageRoutes.js
const express = require("express");
const {
  setMessage,
  getMessages,
  getUsersWhoMessagedHolder, // Importing the new controller
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Existing routes
router.post("/send/:id", protect, setMessage);
router.get("/:id", protect, getMessages);

// New route to get users who messaged the holder
router.get("/holder/messages/users", protect, getUsersWhoMessagedHolder);

module.exports = router;
