const Receipt = require("../models/Receipt");

// =======================================
// All Receipts
// =======================================

exports.getReceipts = async (req, res) => {
  
  try {
    
    const receipts = await Receipt.find()
      
      .sort({
        
        receiptNo: -1
        
      });
    
    res.json(receipts);
    
  }
  
  catch (err) {
    
    res.status(500).json({
      
      error: err.message
      
    });
    
  }
  
};

// =======================================
// Receipt By Number
// =======================================

exports.getReceipt = async (req, res) => {
  
  try {
    
    const receipt = await Receipt.findOne({
      
      receiptNo: req.params.no
      
    });
    
    if (!receipt)
      
      return res.status(404).json({
        
        error: "Receipt not found"
        
      });
    
    res.json(receipt);
    
  }
  
  catch (err) {
    
    res.status(500).json({
      
      error: err.message
      
    });
    
  }
  
};

// =======================================
// Student Receipts
// =======================================

exports.studentReceipts = async (req, res) => {
  
  try {
    
    const receipts = await Receipt.find({
      
      studentId: req.params.id
      
    }).sort({
      
      receiptNo: -1
      
    });
    
    res.json(receipts);
    
  }
  
  catch (err) {
    
    res.status(500).json({
      
      error: err.message
      
    });
    
  }
  
};

// =======================================
// Family Receipts
// =======================================

exports.familyReceipts = async (req, res) => {
  
  try {
    
    const receipts = await Receipt.find({
      
      familyCode: req.params.code
      
    }).sort({
      
      receiptNo: -1
      
    });
    
    res.json(receipts);
    
  }
  
  catch (err) {
    
    res.status(500).json({
      
      error: err.message
      
    });
    
  }
  
};

// =======================================
// Delete Receipt
// =======================================

exports.deleteReceipt = async (req, res) => {
  
  try {
    
    const receipt = await Receipt.findByIdAndDelete(
      
      req.params.id
      
    );
    
    if (!receipt)
      
      return res.status(404).json({
        
        error: "Receipt not found"
        
      });
    
    res.json({
      
      success: true,
      
      message: "Receipt deleted"
      
    });
    
  }
  
  catch (err) {
    
    res.status(500).json({
      
      error: err.message
      
    });
    
  }
  
};