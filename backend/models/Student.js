const mongoose = require("mongoose");

const feeHistorySchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["paid", "partial", "advance", "unpaid"],
      default: "unpaid"
    },

    paidAmount: {
      type: Number,
      default: 0
    },

    paidOn: {
      type: String,
      default: "बाकी"
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
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {

    // =============================
    // BASIC DETAILS
    // =============================

    name: {
      type: String,
      required: true,
      trim: true
    },

    identity: {
      type: String,
      default: ""
    },

    familyCode: {
      type: String,
      default: ""
    },

    batch: {
      type: String,
      enum: ["1-5", "6-8", "9", "10", "CBSE", ""],
      default: ""
    },

    dueDate: {
      type: Number,
      enum: [1, 15],
      default: 1
    },

    monthlyFee: {
      type: Number,
      required: true,
      default: 0
    },

    joinDate: {
      type: Date,
      default: Date.now
    },

    // =============================
    // FAMILY
    // =============================

    isFamilyFee: {
      type: Boolean,
      default: false
    },

    splitType: {
      type: String,
      enum: ["auto", "manual"],
      default: "auto"
    },

    // =============================
    // STATUS
    // =============================

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "LEFT"],
      default: "ACTIVE"
    },

    active: {
      type: Boolean,
      default: true
    },

    verify: {
      type: Boolean,
      default: false
    },

    remarks: {
      type: String,
      default: ""
    },

    inactiveDate: Date,

    leftDate: Date,

    rejoinDate: Date,

    // =============================
    // ACCOUNT
    // =============================

    openingDue: {
      type: Number,
      default: 0
    },

    clearTillMonth: {
      type: Number,
      default: 6
    },

    clearTillYear: {
      type: Number,
      default: 2026
    },

    // =============================
    // FEES HISTORY
    // =============================

    fees: [feeHistorySchema]

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", studentSchema);