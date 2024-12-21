// === Dữ liệu cho task "running", "ended", và "coming" ===

// Dữ liệu số task "running", "ended", "coming" theo ngày trong tháng (31 ngày)
const runningDailyData = Array.from({ length: 31 }, () => Math.floor(Math.random() * 20));
const endedDailyData = Array.from({ length: 31 }, () => Math.floor(Math.random() * 20));
const comingDailyData = Array.from({ length: 31 }, () => Math.floor(Math.random() * 20));

// Dữ liệu số task "running", "ended", "coming" theo tháng trong năm (12 tháng)
const runningMonthlyData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
const endedMonthlyData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));
const comingMonthlyData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100));

// === Biểu đồ cột chồng: Task trạng thái theo ngày trong tháng ===
const endedDailyChart = new Chart(document.getElementById('endedDailyChart'), {
  type: 'bar',
  data: {
    labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Ended',
        data: endedDailyData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Running',
        data: runningDailyData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Coming',
        data: comingDailyData,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Tasks by Status (Daily)' }
    },
    scales: {
      y: { beginAtZero: true }
    },
    stacked: true // Cho phép cột chồng
  }
});

// === Biểu đồ cột chồng: Task trạng thái theo tháng trong năm ===
const endedMonthlyChart = new Chart(document.getElementById('endedMonthlyChart'), {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Ended',
        data: endedMonthlyData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Running',
        data: runningMonthlyData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Coming',
        data: comingMonthlyData,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Tasks by Status (Monthly)' }
    },
    scales: {
      y: { beginAtZero: true }
    },
    stacked: true // Cho phép cột chồng
  }
});

// === Biểu đồ tròn: Trạng thái task hiện tại ===
const statusPieChart = new Chart(document.getElementById('statusPieChart'), {
  type: 'pie',
  data: {
    labels: ['Running', 'Ended', 'Coming'],
    datasets: [{
      label: 'Task Status',
      data: [taskStatusData.running, taskStatusData.ended, taskStatusData.coming],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)', // Running
        'rgba(255, 159, 64, 0.6)', // Ended
        'rgba(255, 205, 86, 0.6)'  // Comming
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 205, 86, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Current Task Status Distribution' }
    }
  }
});


// === Đếm số ngày truy cập liên tiếp ===
const today = new Date();
const todayKey = today.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
// Lấy thông tin từ localStorage
const lastVisit = localStorage.getItem('lastVisit');
let streak = parseInt(localStorage.getItem('streak') || '0', 10);

// Kiểm tra trạng thái
if (lastVisit === todayKey) {
    console.log('Bạn đã truy cập hôm nay. Chuỗi ngày liên tiếp không thay đổi.');
} else {
    const lastVisitDate = lastVisit ? new Date(lastVisit) : null;

    if (lastVisitDate && isYesterday(lastVisitDate, today)) {
        streak += 1;
    } else {
        streak = 1; // Đặt lại chuỗi ngày nếu không liên tiếp
    }

    // Cập nhật ngày truy cập và chuỗi ngày liên tiếp
    localStorage.setItem('lastVisit', todayKey);
    localStorage.setItem('streak', streak);
}

// Cập nhật UI
document.getElementById('streakDays').textContent = streak;

// Hàm kiểm tra nếu `date1` là ngày hôm qua của `date2`
function isYesterday(date1, date2) {
    const diffTime = date2 - date1;
    const diffDays = diffTime / (1000 * 60 * 60 * 24); // Đổi chênh lệch thời gian sang số ngày
    return diffDays === 1;
}

const streakIcon = document.getElementById('streakIcon');
const maxSize = 5;  // Kích thước tối đa của ngọn lửa
const minSize = 2;  // Kích thước tối thiểu của ngọn lửa
const maxStreak = 30;  // Số streak tối đa cho kích thước lớn nhất

let fireSize = minSize + (streak / maxStreak) * (maxSize - minSize);
streakIcon.style.fontSize = `${fireSize}rem`;







