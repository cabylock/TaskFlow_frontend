// === Dữ liệu cho task "ended" ===

// Dữ liệu số task "ended" theo ngày trong tháng (31 ngày)
const endedDailyData = Array.from({ length: 31 }, () => Math.floor(Math.random() * 20));

// Dữ liệu số task "ended" theo tháng trong năm (12 tháng)
const endedMonthlyData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 500));

// === Dữ liệu cho biểu đồ tròn ===
const taskStatusData = {
  running: 10,  // Task đang chạy
  ended: 20,    // Task đã hoàn thành
  coming: 5    // Task sắp đến
};

// === Biểu đồ cột: Task "ended" theo ngày trong tháng ===
const endedDailyChart = new Chart(document.getElementById('endedDailyChart'), {
  type: 'bar',
  data: {
    labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
    datasets: [{
      label: 'Tasks Ended (Daily)',
      data: endedDailyData,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Tasks đã làm trong tháng' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// === Biểu đồ cột: Task "ended" theo tháng trong năm ===
const endedMonthlyChart = new Chart(document.getElementById('endedMonthlyChart'), {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Tasks Ended (Monthly)',
      data: endedMonthlyData,
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Task đã làm trong năm' }
    },
    scales: {
      y: { beginAtZero: true }
    }
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
