const express = require("express");

const router = express.Router();

const receiptController = require("../controllers/receiptController");

// ===================================
// All Receipts
// ===================================

router.get(
  
  "/",
  
  receiptController.getReceipts
  
);

// ===================================
// Receipt By Number
// ===================================

router.get(
  
  "/number/:no",
  
  receiptController.getReceipt
  
);

// ===================================
// Student Receipts
// ===================================

router.get(
  
  "/student/:id",
  
  receiptController.studentReceipts
  
);

// ===================================
// Family Receipts
// ===================================

router.get(
  
  "/family/:code",
  
  receiptController.familyReceipts
  
);

// ===================================
// Delete Receipt
// ===================================

router.delete(
  
  "/:id",
  
  receiptController.deleteReceipt
  
);

module.exports = router;