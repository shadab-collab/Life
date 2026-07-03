const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true
    },

    year: {
      type: Number,
      required: true
    },

    paidAmount: {
      type: Number,
      default: 0
    },

    paidOn: {
      type: String,
      default: "बाकी"
    },

    status: {
      type: String,
      enum: ["paid", "partial", "advance", "unpaid"],
      default: "paid"
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

const familySchema = new mongoose.Schema(
  {
    // ==========================
    // BASIC DETAILS
    // ==========================

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    monthlyFee: {
      type: Number,
      required: true,
      default: 0
    },

    dueDate: {
      type: Number,
      enum: [1, 15],
      default: 1
    },

    splitType: {
      type: String,
      enum: ["auto", "manual"],
      default: "auto"
    },

    // ==========================
    // STATUS
    // ==========================

    active: {
      type: Boolean,
      default: true
    },

    remarks: {
      type: String,
      default: ""
    },

    // ==========================
    // PAYMENT HISTORY
    // ==========================

    paymentHistory: [paymentHistorySchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Family", familySchema);