let endedDailyChart;
let endedMonthlyChart;

document.addEventListener('DOMContentLoaded', async () => {
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  const lastVisit = localStorage.getItem('lastVisit');
  let streak = parseInt(localStorage.getItem('streak'), 10) || 0;

  // Check if `date1` is the day before `date2`
  function isYesterday(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setDate(d1.getDate() + 1);
    return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
  }

  if (lastVisit && isYesterday(lastVisit, todayKey)) {
    streak += 1; // Increment streak if last visit was yesterday
  } else if (lastVisit !== todayKey) {
    streak = 1; // Reset streak if last visit was not today or yesterday
  }

  // Update last visit and streak in local storage
  localStorage.setItem('lastVisit', todayKey);
  localStorage.setItem('streak', streak);

  // Update UI
  document.getElementById('streakDays').textContent = streak;

  const streakIcon = document.getElementById('streakIcon');
  const maxSize = 5;  // Maximum size of the flame
  const minSize = 2;  // Minimum size of the flame
  const maxStreak = 30;  // Maximum streak for the largest size

  let fireSize = minSize + (streak / maxStreak) * (maxSize - minSize);
  streakIcon.style.fontSize = `${fireSize}rem`;

  // === Fetch data from database ===
  await getProjectsFromDatabase();
  
  renderChart();
});

function renderChart()
{
  
  
  // Trích xuất dữ liệu daily
  const { highData: highDailyData, mediumData: mediumDailyData, lowData: lowDailyData } = getDailyData(Tasks, 31);
  
  // Trích xuất dữ liệu monthly
  const { highData: highMonthlyData, mediumData: mediumMonthlyData, lowData: lowMonthlyData } = getMonthlyData(Tasks);
  
  // Hủy biểu đồ cũ nếu tồn tại
  if (endedDailyChart) {
    endedDailyChart.destroy();
  }

  if (endedMonthlyChart) {
    endedMonthlyChart.destroy();
  }

  // === Biểu đồ cột chồng: Task trạng thái theo ngày trong tháng ===
   endedDailyChart = new Chart(document.getElementById('endedDailyChart'), {
    type: 'bar',
    data: {
      labels: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: 'High',
          data: highDailyData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Medium',
          data: mediumDailyData,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        },
        {
          label: 'Low',
          data: lowDailyData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Tasks by Level (Daily)' }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  });
  
  // === Biểu đồ cột chồng: Task trạng thái theo tháng trong năm ===
   endedMonthlyChart = new Chart(document.getElementById('endedMonthlyChart'), {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'High',
          data: highMonthlyData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'Medium',
          data: mediumMonthlyData,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        },
        {
          label: 'Low',
          data: lowMonthlyData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Tasks by Level (Monthly)' }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  });
}

  
  // Hàm trích xuất dữ liệu daily
  const getDailyData = (tasks, daysInMonth) => {
    const highData = Array(daysInMonth).fill(0);
    const mediumData = Array(daysInMonth).fill(0);
    const lowData = Array(daysInMonth).fill(0);
  
    tasks.forEach(task => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);
  
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = new Date(`2024-12-${String(day).padStart(2, '0')}`);
  
        if (currentDay >= startDate && currentDay <= endDate) {
          if (task.level === 'high') highData[day - 1]++;
          else if (task.level === 'medium') mediumData[day - 1]++;
          else if (task.level === 'low') lowData[day - 1]++;
        }
      }
    });
  
    return { highData, mediumData, lowData };
  };
  
  // Hàm trích xuất dữ liệu monthly
  const getMonthlyData = tasks => {
    const highData = Array(12).fill(0);
    const mediumData = Array(12).fill(0);
    const lowData = Array(12).fill(0);
  
    tasks.forEach(task => {
      const startMonth = new Date(task.startDate).getMonth();
      const endMonth = new Date(task.endDate).getMonth();
  
      for (let month = startMonth; month <= endMonth; month++) {
        if (task.level === 'high') highData[month]++;
        else if (task.level === 'medium') mediumData[month]++;
        else if (task.level === 'low') lowData[month]++;
      }
    });
  
    return { highData, mediumData, lowData };
  };


