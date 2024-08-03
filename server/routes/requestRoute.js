const express = require("express");
const {
  setRequest,
  getHolderRequest,
  updateRequest,
  getUserRequest,
  handlePayment,
  sendPaymentReminder,
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, setRequest);
router.get("/holder", protect, getHolderRequest);
router.get("/user", protect, getUserRequest);
router.put("/:id", protect, updateRequest);
router.put("/pay/:id", protect, handlePayment);
router.post("/remind/:id", protect, sendPaymentReminder);

module.exports = router;
