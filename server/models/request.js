const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    boardingHouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BoardingHouse",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    numPersons: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    pricePerMonth: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "accept", "reject"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
