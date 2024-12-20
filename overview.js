// Lấy phần tử hiển thị ở mục Overview
const progressStatisticsList = document.getElementById('progress_statistics_list');
const progressList = document.getElementById('project_list');
// Hàm để hiển thị thống kê tiến độ
function renderOverviewStatistics() {
    progressStatisticsList.innerHTML = ''; // Xóa nội dung cũ

    let totalTasks = number_total;
    let runningTasks = number_running;
    let endedTasks = number_ended;
    let comingTasks = number_coming

    // Tính tỷ lệ hoàn thành
    const completionRate = totalTasks > 0 ? ((endedTasks / totalTasks) * 100).toFixed(2) : 0;

    // Hiển thị dữ liệu thống kê
    progressStatisticsList.innerHTML = `
        <p>Total Tasks: ${totalTasks}</p>
        <p>Running Tasks: ${runningTasks}</p>
        <p>Ended Tasks: ${endedTasks}</p>
        <p>Coming Tasks: ${comingTasks}</p>
        <p>Completion Rate: ${completionRate}%</p>
    `;
}

// Gọi hàm khi cần hiển thị thống kê
renderOverviewStatistics();

  
