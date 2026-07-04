require("dotenv").config(); // Line 1: ✅ सुधार - 'R' को छोटा कर दिया गया है

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const path = require("path");

const app = express();

// ===============================
// Middleware
// ===============================

// ✅ सुधार: CORS को पूरी तरह खोल दिया गया है ताकि ऐप कनेक्शन फेल न हो
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

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
    
    console.log("✅ MongoDB Connected Successfully");
    
  })
  
  .catch(err => {
    
    console.error("❌ MongoDB Connection Error:", err);
    
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
