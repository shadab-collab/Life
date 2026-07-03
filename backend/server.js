require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ===============================
// Static Frontend
// ===============================

app.use(
  
  express.static(
    
    path.join(__dirname, "../frontend")
    
  )
  
);

// ===============================
// Routes
// ===============================

const studentRoutes = require("./routes/students");

const receiptRoutes = require("./routes/receipts");

app.use(
  
  "/api/students",
  
  studentRoutes
  
);

app.use(
  
  "/api/receipts",
  
  receiptRoutes
  
);

// ===============================
// Home
// ===============================

app.get("/", (req, res) => {
  
  res.sendFile(
    
    path.join(
      
      __dirname,
      
      "../frontend/index.html"
      
    )
    
  );
  
});

// ===============================
// MongoDB
// ===============================

mongoose
  
  .connect(process.env.MONGODB_URI)
  
  .then(() => {
    
    console.log("✅ MongoDB Connected");
    
  })
  
  .catch(err => {
    
    console.log(err);
    
  });

// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  
  console.log(
    
    `🚀 Server Running On Port ${PORT}`
    
  );
  
});