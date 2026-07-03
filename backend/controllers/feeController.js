const Student = require("../models/Student");
const Family = require("../models/Family");
const Fee = require("../models/Fee");
const Receipt = require("../models/Receipt");

// ================================
// Today
// ================================

function today() {

  const d = new Date();

  const months = [

    "Jan","Feb","Mar","Apr","May","Jun",

    "Jul","Aug","Sep","Oct","Nov","Dec"

  ];

  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

}

// ================================
// Receipt Number
// ================================

async function nextReceiptNo() {

  const last = await Receipt

    .findOne()

    .sort({ receiptNo: -1 });

  if (!last)

    return 1001;

  return last.receiptNo + 1;

}

// ================================
// Mark Single Student Fee
// ================================

exports.markStudentFee = async (req, res) => {

  try {

    const student = await Student.findById(

      req.params.id

    );

    if (!student)

      return res.status(404).json({

        error: "Student not found"

      });

    const {

      month,

      year,

      status,

      paidAmount,

      paymentMode,

      note

    } = req.body;

    let fee = await Fee.findOne({

      studentId: student._id,

      month,

      year

    });

    if (!fee) {

      fee = new Fee({

        studentId: student._id,

        familyCode: student.familyCode || "",

        month,

        year,

        dueDate: student.dueDate,

        expectedAmount: student.monthlyFee

      });

    }

    fee.status = status;

    fee.paidAmount = paidAmount;

    fee.paymentMode = paymentMode || "Cash";

    fee.note = note || "";

    fee.paidOn =

      status === "unpaid"

      ? "बाकी"

      : today();

    fee.balanceAmount =

      fee.expectedAmount - paidAmount;

    if (fee.balanceAmount < 0)

      fee.balanceAmount = 0;

    await fee.save();
    // ==========================
    // Student Fees Array Update
    // ==========================

    const idx = student.fees.findIndex(
      f =>
        f.month === month &&
        f.year === year
    );

    const feeObject = {

      month,

      year,

      status,

      paidAmount,

      paidOn: fee.paidOn,

      note

    };

    if (idx >= 0)

      student.fees[idx] = feeObject;

    else

      student.fees.push(feeObject);

    await student.save();

    // ==========================
    // Receipt Create
    // ==========================

    if (status !== "unpaid") {

      const receipt = new Receipt({

        receiptNo: await nextReceiptNo(),

        studentId: student._id,

        studentName: student.name,

        familyCode: student.familyCode || "",

        batch: student.batch,

        month,

        year,

        expectedAmount: student.monthlyFee,

        paidAmount,

        balanceAmount:
          student.monthlyFee - paidAmount,

        paymentMode:
          paymentMode || "Cash",

        status,

        paidOn: today(),

        note

      });

      await receipt.save();

    }

    res.json({

      success: true,

      student

    });

  }

  catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

};

// =======================================
// Mark Family Fee
// =======================================

exports.markFamilyFee = async (req, res) => {

  try {

    const family = await Family.findOne({

      code: req.params.code

    });

    if (!family)

      return res.status(404).json({

        error: "Family not found"

      });

    const members = await Student.find({

      familyCode: req.params.code,

      active: true

    });

    if (!members.length)

      return res.status(404).json({

        error: "No active members"

      });

    const {

      month,

      year,

      status,

      paidAmount,

      paymentMode,

      note

    } = req.body;

    const splitAmount = Math.round(

      paidAmount / members.length

    );
    // =======================================
    // Update Every Family Member
    // =======================================

    for (const student of members) {

      let fee = await Fee.findOne({

        studentId: student._id,

        month,

        year

      });

      if (!fee) {

        fee = new Fee({

          studentId: student._id,

          familyCode: student.familyCode,

          month,

          year,

          dueDate: student.dueDate,

          expectedAmount: student.monthlyFee

        });

      }

      fee.status = status;

      fee.paidAmount = splitAmount;

      fee.paymentMode = paymentMode || "Cash";

      fee.note = note || "";

      fee.paidOn =
        status === "unpaid"
          ? "बाकी"
          : today();

      fee.balanceAmount =
        fee.expectedAmount - splitAmount;

      if (fee.balanceAmount < 0)
        fee.balanceAmount = 0;

      await fee.save();

      const idx = student.fees.findIndex(

        f =>

          f.month === month &&

          f.year === year

      );

      const feeObject = {

        month,

        year,

        status,

        paidAmount: splitAmount,

        paidOn: fee.paidOn,

        note

      };

      if (idx >= 0)

        student.fees[idx] = feeObject;

      else

        student.fees.push(feeObject);

      await student.save();

      if (status !== "unpaid") {

        await Receipt.create({

          receiptNo: await nextReceiptNo(),

          studentId: student._id,

          studentName: student.name,

          familyCode: student.familyCode,

          batch: student.batch,

          month,

          year,

          expectedAmount: student.monthlyFee,

          paidAmount: splitAmount,

          balanceAmount:
            student.monthlyFee - splitAmount,

          paymentMode:
            paymentMode || "Cash",

          status,

          paidOn: today(),

          note

        });

      }

    }

    // =======================================
    // Family History
    // =======================================

    family.paymentHistory.push({

      month,

      year,

      paidAmount,

      paidOn: today(),

      note

    });

    await family.save();

    res.json({

      success: true,

      message: "Family fee updated successfully"

    });

  }

  catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

};