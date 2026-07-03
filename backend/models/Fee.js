const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    // ==========================
    // Student Reference
    // ==========================

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    familyCode: {
      type: String,
      default: ""
    },

    // ==========================
    // Month Information
    // ==========================

    month: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    dueDate: {
      type: Number,
      enum: [1, 15],
      default: 1
    },

    // ==========================
    // Fee Information
    // ==========================

    expectedAmount: {
      type: Number,
      required: true
    },

    paidAmount: {
      type: Number,
      default: 0
    },

    balanceAmount: {
      type: Number,
      default: 0
    },

    // ==========================
    // Payment Status
    // ==========================

    status: {
      type: String,
      enum: [
        "unpaid",
        "partial",
        "paid",
        "advance"
      ],
      default: "unpaid"
    },

    paidOn: {
      type: String,
      default: "बाकी"
    },

    paymentMode: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Bank",
        "Other"
      ],
      default: "Cash"
    },

    note: {
      type: String,
      default: ""
    },

    receiptNo: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// एक छात्र के लिए एक महीने का केवल एक रिकॉर्ड
feeSchema.index(
  {
    studentId: 1,
    month: 1,
    year: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model("Fee", feeSchema);