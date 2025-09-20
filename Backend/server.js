const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const postRoutes = require("./routes/postRoutes");
const connectDB = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/posts", postRoutes);

// DB connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
