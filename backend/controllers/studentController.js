const Student = require("../models/Student");

// सभी Active Students
exports.getStudents = async (req, res) => {
  try {
    
    const students = await Student.find({
      active: true
    }).sort({
      name: 1
    });
    
    res.json(students);
    
  } catch (err) {
    
    res.status(500).json({
      error: err.message
    });
    
  }
};

// नया Student
exports.addStudent = async (req, res) => {
  
  try {
    
    const student = new Student({
      
      name: req.body.name,
      
      identity: req.body.identity || "",
      
      familyCode: req.body.familyCode || "",
      
      batch: req.body.batch || "",
      
      dueDate: req.body.dueDate || 1,
      
      monthlyFee: req.body.monthlyFee || 0,
      
      joinDate: req.body.joinDate || new Date(),
      
      isFamilyFee: req.body.isFamilyFee || false,
      
      splitType: req.body.splitType || "auto",
      
      openingDue: req.body.openingDue || 0,
      
      remarks: req.body.remarks || ""
      
    });
    
    await student.save();
    
    res.json(student);
    
  } catch (err) {
    
    res.status(500).json({
      error: err.message
    });
    
  }
  
};

// Student Edit
exports.updateStudent = async (req, res) => {
  
  try {
    
    const student = await Student.findByIdAndUpdate(
      
      req.params.id,
      
      req.body,
      
      {
        new: true,
        runValidators: true
      }
      
    );
    
    if (!student) {
      
      return res.status(404).json({
        error: "Student not found"
      });
      
    }
    
    res.json(student);
    
  } catch (err) {
    
    res.status(500).json({
      error: err.message
    });
    
  }
  
};

// Active / Inactive / Left
exports.changeStatus = async (req, res) => {
  
  try {
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      
      return res.status(404).json({
        error: "Student not found"
      });
      
    }
    
    const newStatus = req.body.status;
    
    if (!["ACTIVE", "INACTIVE", "LEFT"].includes(newStatus)) {
      
      return res.status(400).json({
        error: "Invalid status"
      });
      
    }
    
    student.status = newStatus;
    
    student.active = newStatus === "ACTIVE";
    
    if (newStatus === "INACTIVE")
      student.inactiveDate = new Date();
    
    if (newStatus === "LEFT")
      student.leftDate = new Date();
    
    if (newStatus === "ACTIVE")
      student.rejoinDate = new Date();
    
    await student.save();
    
    res.json(student);
    
  } catch (err) {
    
    res.status(500).json({
      error: err.message
    });
    
  }
  
};

// Single Student
exports.getStudent = async (req, res) => {
  
  try {
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      
      return res.status(404).json({
        error: "Student not found"
      });
      
    }
    
    res.json(student);
    
  } catch (err) {
    
    res.status(500).json({
      error: err.message
    });
    
  }
  
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  
  try {
    
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      
      return res.status(404).json({
        error: "Student not found"
      });
      
    }
    
    res.json({
      success: true,
      message: "Student deleted successfully"
    });
    
  } catch (err) {
    
    res.status(500).json({
      error: err.message
    });
    
  }
  
};
// =======================================
// Delete Student
// =======================================

exports.deleteStudent = async (req, res) => {
  
  try {
    
    const student = await Student.findById(req.params.id);
    
    if (!student)
      
      return res.status(404).json({
        
        error: "Student not found"
        
      });
    
    student.active = false;
    
    student.status = "LEFT";
    
    student.leftDate = new Date();
    
    await student.save();
    
    res.json({
      
      success: true,
      
      message: "Student deleted successfully"
      
    });
    
  }
  
  catch (err) {
    
    res.status(500).json({
      
      error: err.message
      
    });
    
  }
  
};

// =======================================
// Restore Student
// =======================================

exports.restoreStudent = async (req, res) => {
  
  try {
    
    const student = await Student.findById(req.params.id);
    
    if (!student)
      
      return res.status(404).json({
        
        error: "Student not found"
        
      });
    
    student.active = true;
    
    student.status = "ACTIVE";
    
    student.rejoinDate = new Date();
    
    await student.save();
    
    res.json({
      
      success: true,
      
      message: "Student restored"
      
    });
    
  }
  
  catch (err) {
    
    res.status(500).json({
      
      error: err.message
      
    });
    
  }
  
};

// =======================================
// Mark Inactive
// =======================================

exports.makeInactive = async (req, res) => {
  
  try {
    
    const student = await Student.findById(req.params.id);
    
    if (!student)
      
      return res.status(404).json({
        
        error: "Student not found"
        
      });
    
    student.status = "INACTIVE";
    
    student.inactiveDate = new Date();
    
    await student.save();
    
    res.json({
      
      success: true,
      
      message: "Student inactive"
      
    });
    
  }
  
  catch (err) {
    
    res.status(500).json({
      
      error: err.message
      
    });
    
  }
  
};

// =======================================
// Activate Student
// =======================================

exports.makeActive = async (req, res) => {
  
  try {
    
    const student = await Student.findById(req.params.id);
    
    if (!student)
      
      return res.status(404).json({
        
        error: "Student not found"
        
      });
    
    student.status = "ACTIVE";
    
    student.active = true;
    
    await student.save();
    
    res.json({
      
      success: true,
      
      message: "Student activated"
      
    });
    
  }
  
  catch (err) {
    
    res.status(500).json({
      
      error: err.message
      
    });
    
  }
  
};