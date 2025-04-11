if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const DB = require("./data-source");
const app = express();
const PORT = process.env.PORT || 6000;

// Middleware

app.use(cors({
  origin: "http://localhost:8080", // Your frontend origin
  credentials: true,              // 💥 Allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// DB Connect & Server Start
(async () => {
  try {
    await DB.connectToDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Server failed to start: ${error.message}`);
  }
})();
