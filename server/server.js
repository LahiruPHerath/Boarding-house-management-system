require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const boardingRoutes = require("./routes/BoardingHouse");
const requestRoutes = require("./routes/requestRoute");
const reviewRoutes = require("./routes/reviewRoutes");
const visitRoutes = require("./routes/VisitRoute");
const messageRoutes = require("./routes/messageRoutes");
const cron = require("node-cron");
const Request = require("./models/request");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/BoardingHouse", boardingRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/visit", visitRoutes);
app.use(
  "/api/message",
  (req, res, next) => {
    req.io = io;
    next();
  },
  messageRoutes
);

// Link static React build
app.use(express.static("./client/build"));

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const roomName = [senderId, receiverId].sort().join("-");
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  socket.on("sendMessage", (message) => {
    const roomName = [message.senderId, message.receiverId].sort().join("-");
    io.to(roomName).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

// Schedule the task to run at the start of each month
cron.schedule("0 0 1 * *", async () => {
  try {
    const requests = await Request.find({});
    for (const request of requests) {
      if (request.pricePerMonth > 0) {
        request.totalPrice = request.pricePerMonth;
        await request.save();
      }
    }
    console.log("Monthly prices have been reset");
  } catch (error) {
    console.error("Error resetting monthly prices:", error);
  }
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}...`));
