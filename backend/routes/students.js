const express = require("express");

const router = express.Router();

const studentController = require("../controllers/studentController");
const familyController = require("../controllers/familyController");
const feeController = require("../controllers/feeController");

// ======================================
// Student
// ======================================

router.get(
  "/",
  studentController.getStudents
);

router.post(
  "/",
  studentController.addStudent
);

router.put(
  "/:id",
  studentController.updateStudent
);

router.delete(
  "/:id",
  studentController.deleteStudent
);

router.put(
  "/:id/status",
  studentController.changeStatus
);

// ======================================
// Student Fee
// ======================================

router.put(
  "/:id/fees",
  feeController.markStudentFee
);

// ======================================
// Family
// ======================================

router.post(
  "/bulk",
  familyController.createFamily
);

router.get(
  "/family/:code",
  familyController.familyStatus
);

router.put(
  "/family/:code/fees",
  feeController.markFamilyFee
);

router.post(
  "/family/:code/member",
  familyController.addMember
);

router.delete(
  "/family/:code/member/:studentId",
  familyController.removeMember
);

router.delete(
  "/family/:code",
  familyController.deleteFamily
);

module.exports = router;