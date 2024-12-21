let username = localStorage.getItem('username');
const buttonIds = [
    'dashboard',
    'overview',
    'task',
    'profile',
    'notification',
    'video',
    'flashcard',
    'quiz',
    'gpa',
    'faq',

];

const timeSpent = { total: 0 }; // Object để lưu thời gian sử dụng cho từng mục
let currentButtonId = null; // Mục hiện tại
let startTime = null; // Thời gian Start của mục hiện tại

buttonIds.forEach(buttonId => {
    timeSpent[buttonId] = 0; // Mặc định thời gian là 0
});

document.addEventListener('DOMContentLoaded', function () {

    //    update profile
    

    fetch('https://back-end-ocean.up.railway.app/user/get_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
    })
        .then(response => response.json())
        .then(result => {

            document.getElementById('name').innerText = result.name;

            if (result.description) {

                document.getElementById('description').value = result.description;
            }
            if (result.profile_image) {
                document.getElementsByClassName('profileImage').src = `${result.profile_image}`;
            }
           

        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error connection");
        });
    buttonIds.forEach(function (buttonId) {
        const button = document.getElementById(buttonId + '_button');
        button.addEventListener('click', function () {
            const now = Date.now();

            // Nếu đang ở một mục khác, tính thời gian đã sử dụng
            if (currentButtonId && startTime) {
                const elapsedTime = (now - startTime) / 1000; // Thời gian bằng giây
                timeSpent[currentButtonId] += elapsedTime;
                timeSpent.total += elapsedTime;

            }

            // Cập nhật mục hiện tại và thời gian Start
            currentButtonId = buttonId;
            startTime = now;

            // Hiển thị mục được chọn
            document.getElementById(buttonId + '_main').style.display = 'flex';

            if (buttonId === 'video') {
                let video_spent_percentage = (timeSpent["video"] / timeSpent.total * 100).toFixed(2);
                let the_other_percentage = (100 - video_spent_percentage).toFixed(2);

                if (!isNaN(video_spent_percentage)) {
                    const link_chart = `https://quickchart.io/chart/`
                    const chartConfig = {
                        type: 'doughnut',
                        data: {
                            labels: ['Music', 'Other'],
                            datasets: [
                                {
                                    label: 'Time Spent (%)',
                                    data: [video_spent_percentage, the_other_percentage], // Dữ liệu sẽ được gán động
                                    backgroundColor: ['#3498db', '#FF5722'], // Màu nền
                                    borderColor: ['#388E3C', '#E64A19'], // Viền
                                    borderWidth: 1, // Độ dày viền
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true, // Hiển thị chú thích
                                    position: 'top', // Vị trí chú thích
                                    labels: {
                                        font: {
                                            size: 14, // Kích thước chữ
                                        },
                                        color: '#333', // Màu chữ
                                    },
                                },
                                title: {
                                    display: true,
                                    text: 'Time Spent on Activities',
                                    font: {
                                        size: 16, // Kích thước tiêu đề
                                        weight: 'bold',
                                    },
                                    color: '#212121', // Màu tiêu đề
                                },
                            },
                        },
                    };
                    const chartURL = `${link_chart}?width=300&height=200&chart=${encodeURIComponent(
                        JSON.stringify(chartConfig)
                    )}`;

                    document.getElementById('chart').innerHTML = `<img src="${chartURL}" alt="Chart" />`;

                }

            }

            // Ẩn các mục khác
            buttonIds.forEach(function (otherButtonId) {
                if (otherButtonId !== buttonId) {
                    document.getElementById(otherButtonId + '_main').style.display = 'none';
                }
            });
        });
    });












});


function log_out() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

//message bar
const toast = document.querySelector(".toast"),
    closeIcon = document.querySelector(".close"),
    progress = document.querySelector(".progress"),
    text2 = document.querySelector(".text-2");
    let timer1, timer2;


// Hàm hiển thị thông báo với tham số message
function showToast(message,time = 5000) {
    

    


    clearTimeout(timer1);
    clearTimeout(timer2);

    
    setTimeout(() => {
        text2.textContent = message; // Gán nội dung thông báo vào text-2

        toast.classList.add("active");
        progress.classList.add("active");

        timer1 = setTimeout(() => {
            toast.classList.remove("active");
        }, time); // 5s = 5000 milliseconds

        timer2 = setTimeout(() => {
            progress.classList.remove("active");
        }, time + 300); // 5s + 300ms = 5300 milliseconds
    }, 0); // Đặt lại tiến trình ngay lập tức

}

// Khi người dùng bấm vào biểu tượng đóng, ẩn thông báo
closeIcon.addEventListener("click", () => {
    toast.classList.remove("active");

    setTimeout(() => {
        progress.classList.remove("active");
    }, 300);

    clearTimeout(timer1);
    clearTimeout(timer2);
});



