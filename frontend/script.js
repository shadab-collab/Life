// =========================================
// SHADAB COACHING CENTER
// SCRIPT.JS (FINAL V4)
// PART 1
// =========================================

// =========================================
// API BASE URL CONFIGURATION
// =========================================

const API = "/api/students";

let students = [];

let currentStudent = null;

let currentFamily = null;

let currentMonth = "";

let currentYear = 0;

let undoData = null;

const MONTHS = [
  
  "JN", "FB", "MR", "AP", "MY", "JU",
  
  "JL", "AG", "SP", "OC", "NV", "DC"
  
];

// ==========================
// Load Application
// ==========================

window.onload = function() {
  
  loadStudents();
  
  document
    
    .getElementById("stuJoinDate")
    
    .value = todayInput();
  
  document
    
    .getElementById("famJoinDate")
    
    .value = todayInput();
  
};

// ==========================
// Today's Date
// ==========================

function todayInput() {
  
  const d = new Date();
  
  return d.toISOString().split("T")[0];
  
}

// ==========================
// API
// ==========================

async function loadStudents() {
  
  try {
    
    const res = await fetch("/api/students", {
      
      method: "GET",
      
      
      headers: {
        
        "Content-Type": "application/json"
        
      }
      
    });
    
    students = await res.json();
    
    renderStudents(students);
    
    calculateDashboard();
    
  }
  
  catch (err) {
    
    console.log(err);
    
    showAlert("Server Connection Failed");
    
  }
  
}

// ==========================

async function refreshStudents() {
  
  await loadStudents();
  
}

// ==========================

async function postData(url, data) {
  
  const fullUrl = url.startsWith("http") ? url : `https://life-lt97.onrender.com${url}`;
  
  const res = await fetch(fullUrl, {
    
    method: "POST",
    
    headers: {
      
      "Content-Type": "application/json"
      
    },
    
    body: JSON.stringify(data)
    
  });
  
  return await res.json();
  
}

// ==========================

async function putData(url, data) {
  
  const fullUrl = url.startsWith("http") ? url : `https://life-lt97.onrender.com${url}`;
  
  const res = await fetch(fullUrl, {
    
    method: "PUT",
    
    headers: {
      
      "Content-Type": "application/json"
      
    },
    
    body: JSON.stringify(data)
    
  });
  
  return await res.json();
  
}

// ==========================

function todayString() {
  
  const d = new Date();
  
  const m = [
    
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    
  ];
  
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
  
}

// ==========================
// Dashboard
// ==========================

function calculateDashboard() {
  
  let today = 0;
  
  let month = 0;
  
  let due = 0;
  
  const now = new Date();
  
  const cm = MONTHS[now.getMonth()];
  
  const cy = now.getFullYear();
  
  students.forEach(student => {
    
    const fee = (student.fees || []).find(
      
      x =>
      
      x.month === cm
      
      &&
      
      x.year === cy
      
    );
    
    if (
      
      !fee ||
      
      fee.status !== "paid"
      
    ) {
      
      due++;
      
    }
    
    (student.fees || []).forEach(f => {
      
      if (
        
        f.paidOn === todayString()
        
      )
        
        today += Number(f.paidAmount || 0);
      
      if (
        
        f.month === cm
        
        &&
        
        f.year === cy
        
        &&
        
        f.status === "paid"
        
      )
        
        month += Number(f.paidAmount || 0);
      
    });
    
  });
  
  document.getElementById(
    
    "statTodayCollection"
    
  ).innerHTML = "₹" + today;
  
  document.getElementById(
    
    "statMonthCollection"
    
  ).innerHTML = "₹" + month;
  
  document.getElementById(
    
    "statTotalDues"
    
  ).innerHTML = due;
  
}

// =========================================
// PART 2
// Search + Filter + Render
// =========================================

// --------------------------
// Search
// --------------------------

function filterStudents() {
  
  const text = document
    
    .getElementById("searchInput")
    
    .value
    
    .toLowerCase();
  
  const filter = document
    
    .getElementById("filterDue")
    
    .value;
  
  let list = [...students];
  
  // Search
  
  if (text) {
    
    list = list.filter(s => {
      
      return (
        
        (s.name || "").toLowerCase().includes(text)
        
        ||
        
        (s.identity || "").toLowerCase().includes(text)
        
        ||
        
        (s.familyCode || "").toLowerCase().includes(text)
        
      );
      
    });
  
  }
  
  // Filter
  
  switch (filter) {
    
    case "due":
      
      list = list.filter(hasCurrentDue);
      
      break;
      
    case "1":
      
      list = list.filter(x => x.dueDate == 1);
      
      break;
      
    case "15":
      
      list = list.filter(x => x.dueDate == 15);
      
      break;
      
    case "1-5":
      
    case "6-8":
      
    case "9":
      
    case "10":
      
    case "CBSE":
      
      list = list.filter(x => x.batch == filter);
      
      break;
      
  }
  
  renderStudents(list);
  
}

// --------------------------
// Current Month Due
// --------------------------

function hasCurrentDue(student) {
  
  const now = new Date();
  
  const month = MONTHS[now.getMonth()];
  
  const year = now.getFullYear();
  
  const fee = (student.fees || []).find(
    
    x =>
    
    x.month === month
    
    &&
    
    x.year === year
    
  );
  
  if (!fee)
    
    return true;
  
  return fee.status != "paid";
  
}

// --------------------------
// Render
// --------------------------

function renderStudents(list) {
  
  const container = document.getElementById(
    
    "studentList"
    
  );
  
  container.innerHTML = "";
  
  const families = {};
  
  const singles = [];
  
  list.forEach(student => {
    
    if (student.familyCode) {
      
      if (!families[student.familyCode])
        
        families[student.familyCode] = [];
      
      families[student.familyCode].push(student);
      
    }
    
    else {
      
      singles.push(student);
      
    }
    
  });
  
  // Family Cards
  
  Object.keys(families)
    
    .sort()
    
    .forEach(code => {
      
      container.innerHTML += renderFamilyCard(
        
        code,
        
        families[code]
        
      );
      
    });
  
  // Single Cards
  
  singles
    
    .sort((a, b) =>
      
      a.name.localeCompare(b.name)
      
    )
    
    .forEach(student => {
      
      container.innerHTML += renderStudentCard(
        
        student
        
      );
      
    });
  
}

// --------------------------
// Student Status
// --------------------------

function getStudentStatus(student) {
  
  if (hasCurrentDue(student))
    
    return "Due";
  
  return "Clear";
  
}

// =========================================
// PART 3 (REVISED)
// Student Card Rendering
// =========================================

function renderStudentCard(student) {
  
  const due = hasCurrentDue(student);
  
  const badge = due ?
    
    '<span class="badge badge-red">Due</span>' :
    
    '<span class="badge badge-green">Clear</span>';
  
  return `

<div class="student-card">

<div
class="student-header ${due?"due":""}"
onclick="toggleFees('${student._id}')">

<div>

<div class="student-name">

${student.name}

</div>

<div class="student-meta">

${student.identity || "-"}

</div>

<div class="student-meta">

Batch : ${student.batch}

&nbsp;&nbsp;|&nbsp;&nbsp;

Fee : ₹${student.monthlyFee}

</div>

</div>

<div class="student-badges">

${badge}

<button
class="btn-action green"
onclick="event.stopPropagation();openHisabModal('${student._id}')">

📖

</button>

<button
class="btn-action"
onclick="event.stopPropagation();editStudent('${student._id}')">

✏️

</button>

<button
class="btn-action red"
onclick="event.stopPropagation();deleteStudent('${student._id}')">

🗑

</button>

</div>

</div>

<div
id="fees-${student._id}"
class="fees-row"
style="display:none;">

${renderMonthButtons(student)}

</div>

</div>

`;
  
}

// =========================================
// Month Buttons
// =========================================

function renderMonthButtons(student) {
  
  const now = new Date();
  
  const year = now.getFullYear();
  
  let html = "";
  
  MONTHS.forEach(month => {
    
    const fee = (student.fees || []).find(
      
      x => x.month === month &&
      
      x.year === year
      
    );
    
    let cls = "month-unpaid";
    
    if (fee) {
      
      if (fee.status === "paid")
        
        cls = "month-paid";
      
      if (fee.status === "partial")
        
        cls = "month-partial";
      
      if (fee.status === "advance")
        
        cls = "month-advance";
      
    }
    
    html += `

<button

class="month-btn ${cls}"

onclick="openMarkModal(
'${student._id}',
'${month}',
${year}
)">

${month}

</button>

`;
    
  });
  
  return html;
  
}

// =========================================
// Toggle Fee Area
// =========================================

function toggleFees(id) {
  
  const box = document.getElementById("fees-" + id);
  
  if (!box) return;
  
  if (box.style.display === "none") {
    
    box.style.display = "flex";
    
    box.style.flexWrap = "wrap";
    
    box.style.gap = "8px";
    
  } else {
    
    box.style.display = "none";
    
  }
  
}

// =========================================
// PART 4
// Fee Modal
// =========================================

let feeTargetStudent = null;

function openMarkModal(studentId, month, year) {
  
  feeTargetStudent = studentId;
  
  currentMonth = month;
  
  currentYear = year;
  
  const student = students.find(
    
    x => x._id === studentId
    
  );
  
  if (!student) return;
  
  document.getElementById(
    
    "markStudentName"
    
  ).innerHTML = student.name;
  
  document.getElementById(
    
    "feeMonth"
    
  ).value = month;
  
  document.getElementById(
    
    "feeYear"
    
  ).value = year;
  
  const fee = (student.fees || []).find(
    
    x =>
    
    x.month === month
    
    &&
    
    x.year === year
    
  );
  
  if (fee) {
    
    document.getElementById(
      
      "feeStatus"
      
    ).value = fee.status;
    
    document.getElementById(
      
      "feeAmount"
      
    ).value = fee.paidAmount;
    
    document.getElementById(
      
      "feeNote"
      
    ).value = fee.note || "";
    
  }
  
  else {
    
    document.getElementById(
      
      "feeStatus"
      
    ).value = "paid";
    
    document.getElementById(
      
      "feeAmount"
      
    ).value = student.monthlyFee;
    
    document.getElementById(
      
      "feeNote"
      
    ).value = "";
    
  }
  
  document
    
    .getElementById("markFeeModal")
    
    .classList
    
    .add("open");
  
}

// =========================================
// Save Fee
// =========================================

async function saveFee() {
  
  const body = {
    
    month: currentMonth,
    
    year: currentYear,
    
    status:
      
      document.getElementById(
        
        "feeStatus"
        
      ).value,
    
    paidAmount: Number(
      
      document.getElementById(
        
        "feeAmount"
        
      ).value
      
    ),
    
    note:
      
      document.getElementById(
        
        "feeNote"
        
      ).value
    
  };
  
  try {
    
    await putData(
      
      API + "/" + feeTargetStudent + "/fees",
      
      body
      
    );
    
    closeModal(
      
      "markFeeModal"
      
    );
    
    await refreshStudents();
    
    showAlert(
      
      "Fee Saved Successfully"
      
    );
    
  }
  
  catch (err) {
    
    console.log(err);
    
    showAlert(
      
      "Unable To Save Fee"
      
    );
    
  }
  
}

// =========================================
// Alert
// =========================================

function showAlert(msg) {
  
  document.getElementById(
    
    "customAlertMessage"
    
  ).innerHTML = msg;
  
  document.getElementById(
    
    "customAlertModal"
    
  ).classList.add("open");
  
}

// =========================================
// PART 5
// हिसाब (Ledger)
// =========================================

function openHisabModal(studentId) {
  
  const student = students.find(
    
    x => x._id === studentId
    
  );
  
  if (!student) return;
  
  let totalPaid = 0;
  
  let html = `

<table style="width:100%;border-collapse:collapse;">

<tr>

<th>Month</th>

<th>Status</th>

<th>Paid</th>

<th>Date</th>

<th>Note</th>

</tr>

`;
  
  (student.fees || [])
  
    .sort((a, b) => {
      
      if (a.year !== b.year)
        
        return a.year - b.year;
      
      return MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month);
      
    })
    
    .forEach(fee => {
      
      if (fee.status !== "unpaid") {
        
        totalPaid += Number(fee.paidAmount || 0);
        
      }
      
      let color = "#e53935";
      
      if (fee.status === "paid")
        
        color = "#43a047";
      
      if (fee.status === "partial")
        
        color = "#fb8c00";
      
      if (fee.status === "advance")
        
        color = "#1565c0";
      
      html += `

<tr>

<td>${fee.month} ${fee.year}</td>

<td style="color:${color};font-weight:bold;">
${fee.status}
</td>

<td>
₹${fee.paidAmount||0}
</td>

<td>
${fee.paidOn||"-"}
</td>

<td>
${fee.note||"-"}
</td>

</tr>

`;
      
    });
  
  html += `

</table>

<hr>

<h3>

Total Paid :

₹${totalPaid}

</h3>

<div style="margin-top:15px;">

<button
class="btn-save"
onclick="printHisab('${student._id}')">

🖨 Print

</button>

</div>

`;
  
  document.getElementById(
    
    "hisabBody"
    
  ).innerHTML = html;
  
  document
    
    .getElementById("hisabModal")
    
    .classList
    
    .add("open");
  
}

// =========================================
// Print Ledger
// =========================================

function printHisab(studentId) {
  
  const student = students.find(
    
    x => x._id === studentId
    
  );
  
  if (!student) return;
  
  const receipt = document.getElementById(
    
    "receiptBody"
    
  );
  
  receipt.innerHTML =
    
    `

<h2>

SHADAB COACHING CENTER

</h2>

<hr>

<h3>

Student :

${student.name}

</h3>

<p>

Identity :

${student.identity||"-"}

</p>

<p>

Batch :

${student.batch}

</p>

<hr>

${document.getElementById("hisabBody").innerHTML}

`;
  
  closeModal("hisabModal");
  
  document
    
    .getElementById("receiptModal")
    
    .classList
    
    .add("open");
  
}

// =========================================
// PART 6
// Edit / Delete Student
// =========================================

// --------------------------
// Edit Student
// --------------------------

async function editStudent(id){

  const student=students.find(
    
    x=>x._id===id
    
  );

  if(!student) return;

  document.getElementById("stuName").value=student.name;
  
  document.getElementById("stuIdentity").value=student.identity||"";
  
  document.getElementById("stuFee").value=student.monthlyFee;
  
  document.getElementById("stuBatch").value=student.batch;
  
  document.getElementById("stuDueDate").value=student.dueDate;
  
  document.getElementById("stuJoinDate").value=
    
    student.joinDate
    
    ?student.joinDate.substring(0,10)
    
    :todayInput();

  document
    
    .getElementById("addStudentModal")
    
    .classList
    
    .add("open");

  const saveBtn=document.querySelector(
    
    "#addStudentModal .btn-save"
    
  );

  saveBtn.innerHTML="💾 Update";

  saveBtn.onclick=async function(){

    const body={

      name:document.getElementById("stuName").value,

      identity:document.getElementById("stuIdentity").value,

      monthlyFee:Number(
        
        document.getElementById("stuFee").value
        
      ),

      batch:document.getElementById("stuBatch").value,

      dueDate:Number(
        
        document.getElementById("stuDueDate").value
        
      ),

      joinDate:
        
        document.getElementById("stuJoinDate").value

    };

    await putData(
      
      API+"/"+id,
      
      body
      
    );

    closeModal("addStudentModal");

    saveBtn.innerHTML="💾 Save";

    saveBtn.onclick=saveIndividualStudent;

    refreshStudents();

    showAlert("Student Updated");

  };

}

// --------------------------
// Delete Student (Fix: Linked to real DELETE Route)
// --------------------------

function deleteStudent(id){

  const student=students.find(
    
    x=>x._id===id
    
  );

  if(!student) return;

  document.getElementById(
    
    "confirmMessage"
    
  ).innerHTML=

    `Delete <b>${student.name}</b> ?`;

  document
    
    .getElementById("confirmModal")
    
    .classList
    
    .add("open");

  document.getElementById(
    
    "confirmYes"
    
  ).onclick=async function(){

    undoData=JSON.parse(
      
      JSON.stringify(student)
      
    );

    // ✅ सुधार: असली डिलीट रूट को कॉल किया गया है
    const fullUrl = `https://life-lt97.onrender.com/api/students/${id}`;
    
    await fetch(fullUrl, {
      
      method: "DELETE"
      
    });

    closeModal("confirmModal");

    refreshStudents();

    showUndo();

  };

}

// =========================================
// PART 6 (ADDITIONAL FUNCTIONS)
// Open Modal & Save Individual Student
// =========================================

// --------------------------
// Open Add Student Modal
// --------------------------

function openAddStudentModal() {
  
  document.getElementById("stuName").value = "";
  
  document.getElementById("stuIdentity").value = "";
  
  document.getElementById("stuFee").value = "";
  
  document.getElementById("stuBatch").selectedIndex = 0;
  
  document.getElementById("stuDueDate").value = "1";
  
  document.getElementById("stuJoinDate").value = todayInput();
  
  const saveBtn = document.querySelector(
    
    "#addStudentModal .btn-save"
    
  );
  
  saveBtn.innerHTML = "💾 Save";
  
  saveBtn.onclick = saveIndividualStudent;
  
  document
    
    .getElementById("addStudentModal")
    
    .classList
    
    .add("open");
  
}

// --------------------------
// Save Individual Student
// --------------------------

async function saveIndividualStudent() {
  
  const nameInput = document.getElementById("stuName").value.trim();
  
  if (nameInput === "") {
    
    showAlert("Please Enter Student Name");
    
    return;
    
  }
  
  const body = {
    
    name: nameInput,
    
    identity: document.getElementById("stuIdentity").value.trim(),
    
    monthlyFee: Number(
      
      document.getElementById("stuFee").value || 0
      
    ),
    
    batch: document.getElementById("stuBatch").value,
    
    dueDate: Number(
      
      document.getElementById("stuDueDate").value
      
    ),
    
    joinDate: document.getElementById("stuJoinDate").value
    
  };
  
  try {
    
    await postData(
      
      API,
      
      body
      
    );
    
    closeModal("addStudentModal");
    
    refreshStudents();
    
    showAlert("Student Added Successfully");
    
  }
  
  catch (err) {
    
    console.log(err);
    
    showAlert("Unable To Save Student");
    
  }
  
}


// --------------------------
// Undo Bar
// --------------------------

function showUndo(){

  const bar=document.getElementById(
    
    "undoBar"
    
  );

  document.getElementById(
    
    "undoText"
    
  ).innerHTML="Student Archived";

  bar.classList.add("show");

  setTimeout(()=>{

    bar.classList.remove("show");

    undoData=null;

  },5000);

}

// --------------------------
// Undo (Fix: Linked to changeStatus PUT Toggle Route)
// --------------------------

async function undoLastAction(){

  if(!undoData)
    
    return;

  // ✅ सुधार: स्टेटस टोगल रूट का इस्तेमाल छात्र वापस लाने के लिए किया गया है
  await putData(

    API+"/"+undoData._id+"/status",

    {}

  );

  refreshStudents();

  document
    
    .getElementById("undoBar")
    
    .classList
    
    .remove("show");

  undoData=null;

  showAlert("Undo Successful");

}

// =========================================
// PART 7
// Family Management
// =========================================

// -----------------------------------------
// Open Family Modal
// -----------------------------------------

function openAddFamilyModal() {
  
  document.getElementById("famCode").value = "";
  
  document.getElementById("famIdentity").value = "";
  
  document.getElementById("famTotalFee").value = "";
  
  document.getElementById("famBatch").selectedIndex = 0;
  
  document.getElementById("famDueDate").value = "1";
  
  document.getElementById("famSplitType").value = "auto";
  
  document.getElementById("famJoinDate").value = todayInput();
  
  const container = document.getElementById("famMembersContainer");
  
  container.innerHTML = "";
  
  addMoreMemberField();
  
  document
    
    .getElementById("addFamilyModal")
    
    .classList
    
    .add("open");
  
}

// -----------------------------------------
// Add Member Field
// -----------------------------------------

function addMoreMemberField() {
  
  const box = document.getElementById(
    
    "famMembersContainer"
    
  );
  
  const count = box.children.length + 1;
  
  box.insertAdjacentHTML(
    
    "beforeend",
    
    `

<div class="family-member">

<h4>

Member ${count}

</h4>

<input
class="member-name"
type="text"
placeholder="Student Name">

<input
class="member-fee"
type="number"
placeholder="Fee (Manual Split Only)">

</div>

`
    
  );
  
  toggleFamilyFormSplitFields();
  
}

// -----------------------------------------
// Split Type
// -----------------------------------------

function toggleFamilyFormSplitFields() {
  
  const manual =
    
    document.getElementById(
      
      "famSplitType"
      
    ).value === "manual";
  
  document
    
    .querySelectorAll(".member-fee")
    
    .forEach(x => {
      
      x.style.display =
        
        manual
        
        ?
        
        "block"
        
        :
        
        "none";
      
    });
  
}

// -----------------------------------------
// Save Family
// -----------------------------------------

async function saveFamilyGroup() {
  
  const members = [];
  
  const names = document.querySelectorAll(".member-name");
  
  const fees = document.querySelectorAll(".member-fee");
  
  for (let i = 0; i < names.length; i++) {
    
    if (names[i].value.trim() === "")
      
      continue;
    
    members.push({
      
      name: names[i].value.trim(),
      
      monthlyFee: Number(
        
        fees[i].value || 0
        
      )
      
    });
    
  }
  
  if (members.length === 0) {
    
    showAlert(
      
      "Add Minimum One Member"
      
    );
    
    return;
    
  }
  
  const body = {
    
    familyCode:
      
      document.getElementById(
        
        "famCode"
        
      ).value,
    
    identity:
      
      document.getElementById(
        
        "famIdentity"
        
      ).value,
    
    totalFamilyFee: Number(
      
      document.getElementById(
        
        "famTotalFee"
        
      ).value
      
    ),
    
    batch:
      
      document.getElementById(
        
        "famBatch"
        
      ).value,
    
    dueDate: Number(
      
      document.getElementById(
        
        "famDueDate"
        
      ).value
      
    ),
    
    joinDate:
      
      document.getElementById(
        
        "famJoinDate"
        
      ).value,
    
    splitType:
      
      document.getElementById(
        
        "famSplitType"
        
      ).value,
    
    members
    
  };
  
  try {
    
    await postData(
      
      API + "/bulk",
      
      body
      
    );
    
    closeModal(
      
      "addFamilyModal"
      
    );
    
    refreshStudents();
    
    showAlert(
      
      "Family Added Successfully"
      
    );
  
  }
  
  catch (err) {
    
    console.log(err);
    
    showAlert(
      
      "Unable To Save Family"
      
    );
    
  }
  
}

// =========================================
// PART 8
// Family Fee + Family Hisab
// =========================================

// --------------------------
// Family Fee (Fix: Synced with Backend markFamilyFee Router)
// --------------------------

async function markFamilyFee(code) {
  
  const month = currentMonth;
  
  const year = currentYear;
  
  const amount = Number(
    
    document.getElementById("feeAmount").value
    
  );
  
  const status =
    
    document.getElementById("feeStatus").value;
  
  const note =
    
    document.getElementById("feeNote").value;
  
  try {
    
    // ✅ सुधार: बैकएंड राउट /family/:code/fees के साथ सटीक सिंक किया गया
    await putData(
      
      API + "/family/" + code + "/fees",
      
      {
        
        month,
        
        year,
        
        status,
        
        paidAmount: amount,
        
        note
        
      }
      
    );
    
    closeModal("markFeeModal");
    
    refreshStudents();
    
    showAlert("Family Fee Saved");
    
  }
  
  catch (err) {
    
    console.log(err);
    
    showAlert("Unable To Save");
    
  }
  
}

// --------------------------
// Family Hisab
// --------------------------

function openHisabModalForFamily(code) {
  
  const members = students.filter(
    
    x => x.familyCode === code
    
  );
  
  if (!members.length) return;
  
  let total = 0;
  
  let html = `

<h3>

Family Code : ${code}

</h3>

<table style="width:100%;border-collapse:collapse;">

<tr>

<th>Name</th>

<th>Paid</th>

</tr>

`;
  
  members.forEach(student => {
    
    let paid = 0;
    
    (student.fees || []).forEach(f => {
      
      if (f.status !== "unpaid")
        
        paid += Number(f.paidAmount || 0);
      
    });
    
    total += paid;
    
    html += `

<tr>

<td>

${student.name}

</td>

<td>

₹${paid}

</td>

</tr>

`;
    
  });
  
  html += `

</table>

<hr>

<h2>

Total Received :

₹${total}

</h2>

`;
  
  document.getElementById(
    
    "hisabBody"
    
  ).innerHTML = html;
  
  document
    
    .getElementById(
      
      "hisabModal"
      
    )
    
    .classList
    
    .add("open");
  
}

// --------------------------
// WhatsApp Reminder (Fix: Formal institutional name applied)
// --------------------------

function sendReminder(student) {
  
  const msg =
    
    `अभिभावक कृपया ध्यान देंगे

SHADAB COACHING CENTER

${student.name}

की फीस अभी बाकी है।

कृपया जल्द जमा करें।

धन्यवाद।`;
  
  window.open(
    
    "https://wa.me/?text=" +
    
    encodeURIComponent(msg)
    
  );
  
}

// --------------------------
// Family Reminder (Fix: Formal institutional name applied)
// --------------------------

function sendFamilyReminder(code) {
  
  const members = students
    
    .filter(x => x.familyCode === code)
    
    .map(x => x.name)
    
    .join(", ");
  
  const msg =
    
    `अभिभावक कृपया ध्यान देंगे

SHADAB COACHING CENTER

Family : ${code}

(${members})

की फीस बाकी है।

कृपया जल्द जमा करें।

धन्यवाद।`;
  
  window.open(
    
    "https://wa.me/?text=" +
    
    encodeURIComponent(msg)
    
  );
  
}

// =========================================
// PART 9
// Utility Functions
// =========================================

// Current Month
function getCurrentMonth() {
  
  const d = new Date();
  
  return {
    
    month: MONTHS[d.getMonth()],
    
    year: d.getFullYear()
  
  };
  
}

// Visible Months (Current + Previous 11)

function getVisibleMonths() {
  
  const arr = [];
  
  const d = new Date();
  
  for (let i = 0; i < 12; i++) {
    
    const x = new Date(
      
      d.getFullYear(),
      
      d.getMonth() - i,
      
      1
      
    );
    
    arr.unshift({
      
      month: MONTHS[x.getMonth()],
      
      year: x.getFullYear()
      
    });
    
  }
  
  return arr;
  
}

// Before Join Date

function isBeforeJoin(month, year, joinDate) {
  
  if (!joinDate) return false;
  
  const jd = new Date(joinDate);
  
  const m = MONTHS.indexOf(month);
  
  const dt = new Date(year, m, 1);
  
  return dt < new Date(jd.getFullYear(), jd.getMonth(), 1);
  
}

// =========================================
// Verify Student
// =========================================

async function toggleVerify(id) {
  
  const student = students.find(
    
    x => x._id === id
    
  );
  
  if (!student) return;
  
  await putData(
    
    API + "/" + id,
    
    {
      
      verify: !student.verify
      
    }
    
  );
  
  refreshStudents();
  
}

// =========================================
// Active / Inactive
// =========================================

async function changeStudentStatus(id) {
  
  await putData(
    
    API + "/" + id + "/status",
    
    {}
    
  );
  
  refreshStudents();
  
}

// =========================================
// Family Options
// =========================================

function showFamilyOptions(code) {
  
  const ans = confirm(
    
    "Archive this Family?"
    
  );
  
  if (!ans) return;
  
  students
    
    .filter(x => x.familyCode === code)
    
    .forEach(async s => {
      
      await putData(
        
        API + "/" + s._id + "/status",
        
        {}
        
      );
      
    });
  
  setTimeout(
    
    refreshStudents,
    
    500
    
  );
  
}

// =========================================
// Receipt
// =========================================

function openReceipt(html) {
  
  document.getElementById(
    
    "receiptBody"
    
  ).innerHTML = html;
  
  document
    
    .getElementById(
      
      "receiptModal"
      
    )
    
    .classList
    
    .add("open");
  
}

// =========================================
// Refresh
// =========================================

setInterval(
  
  refreshStudents,
  
  30000
  
);

// =========================================
// Initial Load
// =========================================

loadStudents();

// =========================================
// PART 10
// Common Utilities
// =========================================

// Close Modal
function closeModal(id) {
  
  const modal = document.getElementById(id);
  
  if (modal) {
    
    modal.classList.remove("open");
    
  }
  
}

// Close All

function closeAllModals() {
  
  document.querySelectorAll(".modal")
    
    .forEach(m => m.classList.remove("open"));
  
}

// ESC Key

document.addEventListener("keydown", e => {
  
  if (e.key === "Escape") {
    
    closeAllModals();
    
  }
  
});

// Outside Click

window.onclick = function(e) {
  
  document.querySelectorAll(".modal").forEach(modal => {
    
    if (e.target === modal) {
      
      modal.classList.remove("open");
      
    }
    
  });
  
};

// Currency

function money(amount) {
  
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
  
}

// Today's Date

function today() {
  
  const d = new Date();
  
  const m = [
    
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    
  ];
  
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
  
}

// Month Index

function monthIndex(month) {
  
  return MONTHS.indexOf(month);
  
}

// Total Paid

function getTotalPaid(student) {
  
  return (student.fees || [])
    
    .filter(f => f.status !== "unpaid")
    
    .reduce(
      
      (sum, f) => sum + Number(f.paidAmount || 0),
      
      0
      
    );
  
}

// Current Due

function getCurrentDue(student) {
  
  const fee = (student.fees || []).find(
    
    f =>
    
    f.month === getCurrentMonth().month
    
    &&
    
    f.year === getCurrentMonth().year
    
  );
  
  if (!fee)
    
    return student.monthlyFee;
  
  if (fee.status === "paid")
    
    return 0;
  
  return Math.max(
    
    0,
    
    student.monthlyFee -
    
    Number(fee.paidAmount || 0)
    
  );
  
}

// Reload

async function reload() {
  
  await refreshStudents();
  
  filterStudents();
  
}

// Console

console.log(
  
  "✅ SHADAB COACHING CENTER V4 Loaded"
  
);

// =========================================
// PART 11
// Export / Import / Backup
// =========================================

// --------------------------
// Export JSON
// --------------------------

function exportStudents() {
  
  const data = JSON.stringify(
    
    students,
    
    null,
    
    2
    
  );
  
  const blob = new Blob(
    
    [data],
    
    {
      
      type: "application/json"
      
    }
    
  );
  
  const a = document.createElement("a");
  
  a.href = URL.createObjectURL(blob);
  
  a.download = "students_backup.json";
  
  a.click();
  
  URL.revokeObjectURL(a.href);
  
}

// --------------------------
// Import JSON
// --------------------------

function importStudents(file) {
  
  const reader = new FileReader();
  
  reader.onload = async function(e) {
    
    try {
      
      const data = JSON.parse(e.target.result);
      
      for (const student of data) {
        
        delete student._id;
        
        await postData(
          
          API,
          
          student
          
        );
        
      }
      
      refreshStudents();
      
      showAlert(
        
        "Backup Imported"
        
      );
      
    }
    
    catch (err) {
      
      showAlert(
        
        "Invalid Backup File"
        
      );
      
    }
    
  };
  
  reader.readAsText(file);
  
}

// --------------------------
// Auto Backup
// --------------------------

function autoBackup() {
  
  localStorage.setItem(
    
    "students_backup",
    
    JSON.stringify(students)
    
  );
  
  console.log(
    
    "Backup Saved"
    
  );
  
}

// Every 5 Minutes

setInterval(
  
  autoBackup,
  
  300000
  
);

// --------------------------
// Restore Local Backup
// --------------------------

function restoreBackup() {
  
  const data = localStorage.getItem(
    
    "students_backup"
    
  );
  
  if (!data)
    
    return;
  
  try {
    
    students = JSON.parse(data);
    
    renderStudents(students);
    
    calculateDashboard();
    
  }
  
  catch (err) {
    
    console.log(err);
    
  }
  
}

// --------------------------
// Print Receipt
// --------------------------

function printReceipt() {
  
  window.print();
  
}

// --------------------------
// Initialize
// --------------------------

window.addEventListener(
  
  "beforeunload",
  
  autoBackup
  
);

console.log(
  
  "Frontend Ready"
  
);
