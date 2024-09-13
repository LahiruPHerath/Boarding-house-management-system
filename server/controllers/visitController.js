const express = require("express");
const Visit = require("../models/Visit");
const BoardingHouse = require("../models/BoardingHouse");
const router = express.Router();

const setVisit = async (req, res) => {
  try {
    const { boardingHouse, date, time } = req.body;

    const newVisit = new Visit({
      boardingHouse,
      user: req.user._id,
      date,
      time,
      status: "pending",
    });
    await newVisit.save();
    res.status(201).json(newVisit);
  } catch (error) {
    console.log("Error creating visit: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getHolderVisit = async (req, res) => {
  try {
    if (req.user.role !== "holder") {
      return res.status(403).send({ error: "Access Denied" });
    }

    const boardingHouses = await BoardingHouse.find({ user: req.user._id });
    const boardingHouseIds = boardingHouses.map((house) => house._id);
    const visits = await Visit.find({
      boardingHouse: { $in: boardingHouseIds },
    })
      .populate("boardingHouse")
      .populate("user");
    res.status(201).json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserVisit = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).send({ error: "Access Denied" });
    }

    const visits = await Visit.find({ user: req.user._id })
      .populate({
        path: "boardingHouse",
        populate: {
          path: "user",
          model: "user",
          select: "contactNumber",
        },
      })
      .populate("user");
    res.status(201).json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateVisit = async (req, res) => {
  const { status, rejectionReason } = req.body; // Accept rejectionReason from the request body
  const { id } = req.params;

  try {
    const visitAppointments = await Visit.findById(id);

    if (!visitAppointments) {
      return res.status(404).json({ message: "Visit not found" });
    }

    visitAppointments.status = status;

    // Only update the rejection reason if the status is "reject"
    if (status === "reject") {
      if (!rejectionReason) {
        return res
          .status(400)
          .json({ message: "Rejection reason is required" });
      }
      visitAppointments.rejectionReason = rejectionReason;
    }

    await visitAppointments.save();
    res.status(200).json({ message: "Visit updated successfully" });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  setVisit,
  getHolderVisit,
  updateVisit,
  getUserVisit,
};
