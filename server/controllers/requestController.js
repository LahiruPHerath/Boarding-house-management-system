// routes/requestRoute.js
const express = require("express");
const router = express.Router();
const Request = require("../models/request");
const BoardingHouse = require("../models/BoardingHouse");
const { User } = require("../models/user");
const sendEmail = require("../mail");
const emailTemplate = require("../mailStyle");
const paymentSuccessTemplate = require("../paymentSuccess");

const setRequest = async (req, res) => {
  try {
    const { boardingHouseId, numPersons, totalPrice } = req.body;
    const boardingHouse = await BoardingHouse.findById(boardingHouseId);
    if (!boardingHouse) {
      return res
        .status(404)
        .json({ message: "Boarding House Not Found When requesting" });
    }

    const newRequest = new Request({
      boardingHouse: boardingHouseId,
      numPersons,
      totalPrice,
      status: "pending",
      user: req.user._id,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getHolderRequest = async (req, res) => {
  try {
    if (req.user.role !== "holder") {
      return res.status(403).send({ error: "Access Denied" });
    }

    const boardingHouses = await BoardingHouse.find({ user: req.user._id });
    const boardingHouseIds = boardingHouses.map((house) => house._id);
    const holderRequest = await Request.find({
      boardingHouse: { $in: boardingHouseIds },
    })
      .populate("boardingHouse")
      .populate("user");

    res.status(201).json(holderRequest);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserRequest = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).send({ error: "Access Denied" });
    }

    const holderRequest = await Request.find({ user: req.user._id })
      .populate({
        path: "boardingHouse",
        populate: {
          path: "user",
          model: "user",
          select: "contactNumber",
        },
      })
      .populate("user");

    res.status(201).json(holderRequest);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handlePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const request = await Request.findById(id)
      .populate({
        path: "boardingHouse",
        populate: {
          path: "user",
          model: "user",
          select: "email",
        },
      })
      .populate("user");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Process the payment (pseudo code)
    const paymentSuccessful = true; // Replace with actual payment processing logic

    if (paymentSuccessful) {
      request.totalPrice -= amount;
      request.pricePerMonth = amount;
      await request.save();

      const userEmail = request.user.email;
      const holderEmail = request.boardingHouse.user.email;

      // Get the current month
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const currentMonth = monthNames[new Date().getMonth()];

      const emailContent = paymentSuccessTemplate(
        request.pricePerMonth,
        request.boardingHouse.name,
        currentMonth
      );

      sendEmail(userEmail, "Payment Successful", emailContent);
      sendEmail(holderEmail, "Payment Successful", emailContent);

      res.json(request);
    } else {
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRequest = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    if (req.user.role !== "holder") {
      return res.status(403).send({ error: "Access Denied" });
    }

    const request = await Request.findById(id);
    const boardingHouse = await BoardingHouse.findById(request.boardingHouse);
    if (boardingHouse.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "Unauthorized" });
    }
    request.status = status;
    await request.save();

    res.json({ message: "Request status updated", request });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendPaymentReminder = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("user")
      .populate("boardingHouse");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonth = monthNames[new Date().getMonth()];

    const userEmail = request.user.email;
    const emailText = emailTemplate(
      request.totalPrice,
      request.boardingHouse.name,
      currentMonth
    );

    await sendEmail(userEmail, "Payment Reminder", emailText);
    res.status(200).json({ message: "Reminder email sent successfully" });
  } catch (error) {
    console.error("Error sending reminder email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  setRequest,
  getHolderRequest,
  updateRequest,
  getUserRequest,
  handlePayment,
  sendPaymentReminder,
};
