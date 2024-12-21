const tableBody = document.querySelector("#subjectTable tbody");
const gpaResult = document.getElementById("gpaResult");
const improveCourses = document.getElementById("improveCourses");
const improveList = document.getElementById("improveList");
const retakeCourses = document.getElementById("retakeCourses");
const retakeList = document.getElementById("retakeList");
let totalWeightedScore = 0;
let totalCredits = 0;

function calculateGradeLetter(score) {
  if (score >= 9) return ["A+", 4.0];
  if (score >= 8.5) return ["A", 3.7];
  if (score >= 8) return ["B+", 3.5];
  if (score >= 7) return ["B", 3.0];
  if (score >= 6.5) return ["C+", 2.5];
  if (score >= 5.5) return ["C", 2.0];
  if (score >= 5) return ["D+", 1.5];
  if (score >= 4) return ["D", 1.0];
  return ["F", 0.0];
}

function getGpaClassification(gpa) {
  if (gpa >= 3.6) return "Xuất sắc";
  if (gpa >= 3.2) return "Giỏi";
  if (gpa >= 2.5) return "Khá";
  return "Trung bình";
}

function updateResults() {
  const gpa = (totalWeightedScore / totalCredits).toFixed(2);
  const classification = getGpaClassification(gpa);
  gpaResult.textContent = `GPA: ${gpa} (${classification})`;

  improveCourses.textContent = `Retake Courses: ${improveList.children.length}`;
  retakeCourses.textContent = `Repeat Courses: ${retakeList.children.length}`;
}

function addSubjectToList() {
  const subjectName = document.getElementById("subjectName").value.trim();
  const credit = parseInt(document.getElementById("credit").value);
  const componentScore =
    parseFloat(document.getElementById("componentScore").value) || 0;
  const midtermScore =
    parseFloat(document.getElementById("midtermScore").value) || 0;
  const finalScore =
    parseFloat(document.getElementById("finalScore").value) || 0;

  if (
    !subjectName ||
    isNaN(credit) ||
    isNaN(componentScore) ||
    isNaN(midtermScore) ||
    isNaN(finalScore)
  ) {
    showToast("Fail","Please fill in all fields", 3000);
    return;
  }

  // Tính điểm hệ 10
  const totalScore = (
    componentScore * 0.1 +
    midtermScore * 0.3 +
    finalScore * 0.6
  ).toFixed(2);

  // Tính điểm chữ và hệ 4
  const [gradeLetter, gradePoint] = calculateGradeLetter(totalScore);

  // Cập nhật tổng GPA
  totalWeightedScore += gradePoint * credit;
  totalCredits += credit;

  // Thêm hàng vào bảng
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${subjectName}</td>
        <td>${credit}</td>
        <td>${totalScore}</td>
        <td>${gradeLetter}</td>
        <td>${gradePoint.toFixed(2)}</td>
        <td><button class="delete-btn">X</button></td>
      `;

  const deleteButton = row.querySelector(".delete-btn");
  deleteButton.addEventListener("click", () =>
    deleteSubject(row, gradePoint, credit, gradeLetter, subjectName)
  );

  tableBody.appendChild(row);

  // Xử lý danh sách môn học cần cải thiện hoặc học lại
  if (gradeLetter === "D" || gradeLetter === "D+") {
    const item = document.createElement("li");
    item.textContent = `${subjectName} (${credit} credits)`;
    item.dataset.subjectName = subjectName;
    improveList.appendChild(item);
  } else if (gradeLetter === "F") {
    const item = document.createElement("li");
    item.textContent = `${subjectName} (${credit} credits)`;
    item.dataset.subjectName = subjectName;
    retakeList.appendChild(item);
  }

  updateResults();
}

function deleteSubject(row, gradePoint, credit, gradeLetter, subjectName) {
  // Cập nhật tổng GPA
  totalWeightedScore -= gradePoint * credit;
  totalCredits -= credit;

  // Xóa môn khỏi danh sách cần cải thiện hoặc học lại
  if (gradeLetter === "D" || gradeLetter === "D+") {
    const item = improveList.querySelector(
      `[data-subject-name="${subjectName}"]`
    );
    if (item) item.remove();
  } else if (gradeLetter === "F") {
    const item = retakeList.querySelector(
      `[data-subject-name="${subjectName}"]`
    );
    if (item) item.remove();
  }

  // Xóa dòng khỏi bảng
  row.remove();

  updateResults();
}

function resetTable() {
  // Xóa toàn bộ nội dung bảng
  tableBody.innerHTML = "";

  // Đặt lại các giá trị GPA và tín chỉ
  totalWeightedScore = 0;
  totalCredits = 0;
  gpaResult.textContent = "GPA: ";

  // Xóa danh sách môn học cần cải thiện và học lại
  improveList.innerHTML = "";
  retakeList.innerHTML = "";
  improveCourses.textContent = "Retake courses: 0";
  retakeCourses.textContent = "Repeat courses: 0";
}

document
  .getElementById("addSubject")
  .addEventListener("click", addSubjectToList);
document.getElementById("resetTable").addEventListener("click", resetTable);