const express = require("express");
const router = express.Router();
const BoardingHouse = require("../../models/BoardingHouse");

// Get all boardings
router.get("/", async (req, res) => {
  try {
    const boardings = await BoardingHouse.find();
    res.json(boardings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new boarding house
router.post("/", async (req, res) => {
  const { name, location, description } = req.body;
  const boarding = new BoardingHouse({ name, location, description });
  
  try {
    const newBoarding = await boarding.save();
    res.status(201).json(newBoarding);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a boarding house
router.put("/:id", async (req, res) => {
  try {
    const boarding = await BoardingHouse.findById(req.params.id);
    if (!boarding) return res.status(404).json({ message: "Boarding house not found" });

    const { name, location, description } = req.body;
    boarding.name = name || boarding.name;
    boarding.location = location || boarding.location;
    boarding.description = description || boarding.description;

    const updatedBoarding = await boarding.save();
    res.json(updatedBoarding);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a boarding house
router.delete("/:id", async (req, res) => {
  try {
    const boarding = await BoardingHouse.findByIdAndDelete(req.params.id);
    if (!boarding) return res.status(404).json({ message: "Boarding house not found" });
    res.json({ message: "Boarding house deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
