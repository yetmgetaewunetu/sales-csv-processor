// Main server file for CSV processing application
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { uploadSalesData } = require("./controllers/salesController");

// Create Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(express.json());

// Configure file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create upload middleware
const upload = multer({ storage });

// Serve static files from uploads directory
app.use("/download", express.static("uploads"));

// API routes
app.post("/upload", upload.single("file"), uploadSalesData);

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 