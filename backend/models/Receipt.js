const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    // ==========================
    // Receipt Information
    // ==========================

    receiptNo: {
      type: Number,
      required: true,
      unique: true
    },

    // ==========================
    // Student Information
    // ==========================

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    studentName: {
      type: String,
      required: true
    },

    familyCode: {
      type: String,
      default: ""
    },

    batch: {
      type: String,
      default: ""
    },

    // ==========================
    // Fee Details
    // ==========================

    month: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    expectedAmount: {
      type: Number,
      default: 0
    },

    paidAmount: {
      type: Number,
      required: true
    },

    balanceAmount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: [
        "paid",
        "partial",
        "advance"
      ],
      default: "paid"
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

    paidOn: {
      type: String,
      required: true
    },

    note: {
      type: String,
      default: ""
    },

    // ==========================
    // System
    // ==========================

    generatedBy: {
      type: String,
      default: "System"
    }
  },
  {
    timestamps: true
  }
);

// तेज़ Search के लिए Index
receiptSchema.index({
  receiptNo: 1
});

receiptSchema.index({
  studentId: 1
});

receiptSchema.index({
  month: 1,
  year: 1
});

module.exports = mongoose.model("Receipt", receiptSchema);