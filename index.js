// Import express
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");

const pool = require("./database/db.js");

const userRouter = require("./routers/userRouter.js");
const appointmentRouter = require("./routers/appointmentRouter.js");
const adminRouter = require("./routers/adminRouter.js");
const doctorRouter = require("./routers/doctorRouter.js");
const patientRouter = require("./routers/patientRouter.js");

// Create an express application
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  path: "/api/v1/socket.io",
  cors: {
    origin: process.env.FRONTEND_URL,
  },
  pingTimeout: 7000,
  pingInterval: 3000,
});

// Define a port
const PORT = 3001;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://medi-care-iq.vercel.app",
      "*",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    delete onlineUsers[socket.username];
    io.emit("updateOnlineUsers", Object.keys(onlineUsers));
  });

  socket.on("setUsername", (username) => {
    socket.username = username;
    onlineUsers[username] = socket.id;
    console.log(onlineUsers);
    io.emit("updateOnlineUsers", Object.keys(onlineUsers));
  });

  socket.on("callUser", (data) => {
    console.log("Started new call", data);
    const calleeSocketId = onlineUsers[data.calleeUsername];

    io.to(calleeSocketId).emit("incomingCall", {
      callerUsername: socket.username,
      offer: data.offer,
      token:data.token
    });
  });

  socket.on("acceptCall", (data) => {
    const callerSocketId = onlineUsers[data.callerUsername];

    io.to(callerSocketId).emit("callAccepted", data.answer);
  });

  socket.on("iceCandidate", (data) => {
    const targetSocketId = onlineUsers[data.targetUsername];

    io.to(targetSocketId).emit("iceCandidate", data.candidate);
  });
});
// Define a route for the root path
app.get("/", (req, res) => {
  res.send("Hello World! how are you");
});

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/patient", patientRouter);

// Optionally check the database connection before starting the server
async function startServer() {
  try {
    await pool.query("SELECT 1"); // Simple query to check connection
    console.log("Database connection has been established successfully.");
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();

// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
