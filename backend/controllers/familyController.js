const Student = require("../models/Student");
const Family = require("../models/Family");

// ==============================
// Create New Family
// ==============================

exports.createFamily = async (req, res) => {

  try {

    const {

      familyCode,

      splitType,

      totalFamilyFee,

      dueDate,

      batch,

      identity,

      joinDate,

      members

    } = req.body;

    const alreadyExists = await Family.findOne({
      code: familyCode
    });

    if (alreadyExists) {

      return res.status(400).json({
        error: "Family already exists"
      });

    }

    const family = await Family.create({

      code: familyCode,

      monthlyFee: totalFamilyFee,

      dueDate,

      splitType

    });

    let autoFee = 0;

    if (
      splitType === "auto" &&
      members.length > 0
    ) {

      autoFee = Math.round(
        totalFamilyFee / members.length
      );

    }

    const savedMembers = [];

    for (const member of members) {

      const student = await Student.create({

        name: member.name,

        identity,

        familyCode,

        batch,

        dueDate,

        joinDate,

        monthlyFee:
          splitType === "auto"
            ? autoFee
            : member.monthlyFee,

        isFamilyFee: true,

        active: true,

        status: "ACTIVE"

      });

      savedMembers.push(student);

    }

    res.json({

      success: true,

      family,

      members: savedMembers

    });

  }

  catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

};

// ==============================
// Family Details
// ==============================

exports.familyStatus = async (req, res) => {

  try {

    const family = await Family.findOne({

      code: req.params.code

    });

    if (!family) {

      return res.status(404).json({

        error: "Family not found"

      });

    }

    const members = await Student.find({

      familyCode: req.params.code

    }).sort({

      name: 1

    });

    res.json({

      family,

      members

    });

  }

  catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

};

// ==============================
// Delete Complete Family
// ==============================

exports.deleteFamily = async (req, res) => {

  try {

    await Student.deleteMany({

      familyCode: req.params.code

    });

    await Family.deleteOne({

      code: req.params.code

    });

    res.json({

      success: true,

      message: "Family deleted successfully"

    });

  }

  catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

};

// ==============================
// Add Member
// ==============================

exports.addMember = async (req, res) => {

  try {

    const family = await Family.findOne({

      code: req.params.code

    });

    if (!family) {

      return res.status(404).json({

        error: "Family not found"

      });

    }

    const student = await Student.create({

      ...req.body,

      familyCode: req.params.code,

      isFamilyFee: true,

      active: true,

      status: "ACTIVE"

    });

    res.json(student);

  }

  catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

};

// ==============================
// Remove Member
// ==============================

exports.removeMember = async (req, res) => {

  try {

    await Student.findByIdAndDelete(

      req.params.studentId

    );

    res.json({

      success: true

    });

  }

  catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

};