const showNotification = true;


const notificationList= document.querySelector(".notification_list")
    const notificationDoneBox= document.querySelector(".notification_done_list")

// Hàm định dạng ngày thành dd/mm/yyyy
function DateForNotification(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

// Tính tuần của năm
function getWeekNumber(date) {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + 1) / 7);
}

// Hàm lọc và hiển thị thông báo
function filterEvents() {
    const dateInput = document.getElementById("date").value;
    const timeFilter = document.getElementById("time").value;
    const selectedDate = new Date(dateInput);

    
    notificationDoneBox.innerHTML = "";
    notificationList.innerHTML = "";
    
    
    Tasks.forEach((event,index) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        
        // Kiểm tra cho tuần, tháng, năm
        if (timeFilter === "week") {

            const selectedWeek = getWeekNumber(selectedDate);
            
            if (selectedWeek === getWeekNumber(eventStart)) {
                displayNotifications(event.name,"Start",event.level,eventStart,event.completed_start,index);
            }
            if (selectedWeek === getWeekNumber(eventEnd)) {
                displayNotifications(event.name,"End",event.level,eventEnd,event.completed_end,index);
            }
        }
        else if (timeFilter === "month") {
            if (selectedDate.getFullYear() === eventStart.getFullYear() && selectedDate.getMonth() === eventStart.getMonth()) {
                displayNotifications(event.name,"Start",event.level,eventStart,event.completed_start,index);
            }
            if (selectedDate.getFullYear() === eventEnd.getFullYear() && selectedDate.getMonth() === eventEnd.getMonth()) {
                displayNotifications(event.name,"End",event.level,eventEnd,event.completed_end,index);
            }
        }
        else if (timeFilter === "year") {
            if (selectedDate.getFullYear() === eventStart.getFullYear()) {
                displayNotifications(event.name,"Start",event.level,eventStart,event.completed_start,index);
            }
            if (selectedDate.getFullYear() === eventEnd.getFullYear()) {
                displayNotifications(event.name,"End",event.level,eventEnd,event.completed_end,index);
            }
        }
        else if (timeFilter === "all_time") {
            displayNotifications(event.name,"Start",event.level,eventStart,event.completed_start,index);
            displayNotifications(event.name,"End",event.level,eventEnd,event.completed_end,index);
            
        }
        


    });


    
}

// Hiển thị các thông báo
function displayNotifications(name,status,level,date,completed,index) {
   
    

        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.classList.add(`${level}`) // Thêm class cho notification

        
        date = new Date(date);
        const eventHTML = `
           <p>
               <strong>Event:</strong> ${name} <br>
               <strong>${status} on :</strong> ${DateForNotification(date)}
           </p>
       `;
        notification.innerHTML = eventHTML;

        // Thêm checkbox "Markdone"
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("markdone");
        
        checkbox.addEventListener("change", (e) => {
            if (e.target.checked) {
                notification.style.opacity = "0.6";
                notificationDoneBox.insertBefore(notification, notificationDoneBox.firstChild); // Thêm vào đầu danh sách
                if (status === "Start") {
                    Tasks[index].completed_start = true;
                }
                else {
                    Tasks[index].completed_end = true;
                }
                saveProjectsToDatabase();
                
                
            } 
            else {
                notification.style.opacity = "1";
                notificationList.appendChild(notification);
                if (status === "Start") {
                    Tasks[index].completed_start = false;
                }
                else {
                    Tasks[index].completed_end = false;
                }
                saveProjectsToDatabase();
            }
        });
        notification.appendChild(checkbox);
        
        if (completed) {
            checkbox.checked = true;
            notification.style.opacity = "0.6";
            notificationDoneBox.insertBefore(notification, notificationDoneBox.firstChild); // Thêm vào đầu danh sách
            return;
        }

        

        notificationList.appendChild(notification);
    
}

function scheduleNotifications() {
    const notifyDays = parseInt(document.getElementById("notify_days").value, 10);
    const notifyTime = document.getElementById("notify_time").value;
    
    const now = new Date();

    Tasks.forEach((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

        // Calculate notificationTimeStart
        const notificationTimeStart = new Date(eventStart);
        notificationTimeStart.setDate(notificationTimeStart.getDate() - notifyDays);
        const [notifyHour, notifyMinute] = notifyTime.split(':').map(Number);
        notificationTimeStart.setHours(notifyHour, notifyMinute, 0, 0);

        // Calculate notificationTimeEnd
        const notificationTimeEnd = new Date(eventEnd);
        notificationTimeEnd.setDate(notificationTimeEnd.getDate() - notifyDays);
        notificationTimeEnd.setHours(notifyHour, notifyMinute, 0, 0);

        // Hiển thị thông báo nếu thời gian thỏa mãn điều kiện
        if (notificationTimeStart > now && notificationTimeStart <= now) {
            showToast("",`${event.name} will Start one ${DateForNotification(eventStart)}`, 2000);
        }
        
        if (notificationTimeEnd > now && notificationTimeEnd <= now) {
            showToast("",`${event.name} will End on ${DateForNotification(eventEnd)}`,2000);
        }
    });
}

document.getElementById("save_notification_settings").addEventListener("click", () => {
    const notifyDays = parseInt(document.getElementById("notify_days").value, 10);
    const notifyTime = document.getElementById("notify_time").value;
    localStorage.setItem("notify_days", notifyDays);
    localStorage.setItem("notify_time", notifyTime);
    showToast("",`Save notification: before ${notifyDays} at ${notifyTime}`);

    // Schedule or update notifications via backend
    Tasks.forEach((event) => {
        if (event.completed_start || event.completed_end) {
            return;
        }
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

         // Calculate notificationTimeStart
         const notificationTimeStart = new Date(eventStart);
         notificationTimeStart.setDate(notificationTimeStart.getDate() - notifyDays);
         const [notifyHour, notifyMinute] = notifyTime.split(':').map(Number);
         notificationTimeStart.setHours(notifyHour, notifyMinute, 0, 0);
 
         // Calculate notificationTimeEnd
         const notificationTimeEnd = new Date(eventEnd);
         notificationTimeEnd.setDate(notificationTimeEnd.getDate() - notifyDays);
         notificationTimeEnd.setHours(notifyHour, notifyMinute, 0, 0);
 
         const now = new Date();
         console.log(notifyTime, now);
        
        

        if (notificationTimeStart > now) {
            fetch('https://back-end-ocean.up.railway.app/email/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: notificationTimeStart.toISOString().split('T')[0],
                    time: notifyTime,
                    to: localStorage.getItem('email'),
                    subject: `Reminder: Event ${event.name} is starting soon`,
                    text: `The event ${event.name} is scheduled to start on ${DateForNotification(eventStart)}.`
                })
            }).then(response => response.json())
              .then(data => console.log(data.message))
              .catch(error => console.error('Error:', error));


              document.getElementById('clear_notification_settings').addEventListener('click', () => {

                // Send cancel request to backend
                fetch('https://back-end-ocean.up.railway.app/email/cancel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        
                        to: localStorage.getItem('email'),
                        

                    }),
                })
                .then(response => response.json())
                .then(data => {
                    showToast("",data.message);
                })
                .catch(error => {
                    console.error('Error cancelling notifications:', error);
                    showToast("Fail","Error cancelling notifications");
                });
            
                showNotification = false;
            
                    });


        }

        if (notificationTimeEnd > now) {
            fetch('https://back-end-ocean.up.railway.app/email/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: notificationTimeEnd.toISOString().split('T')[0],
                    time: notifyTime,
                    to: localStorage.getItem('email'),
                    subject: `Reminder: Event ${event.name} is ending soon`,
                    text: `The event ${event.name} is scheduled to end on ${DateForNotification(eventEnd)}.`
                })
            }).then(response => response.json())
              .then(data => console.log(data.message))
              .catch(error => console.error('Error:', error));
        }
    });
});

document.getElementById('clear_notification_settings').addEventListener('click', () => {

    // Send cancel request to backend
    fetch('https://back-end-ocean.up.railway.app/email/cancel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            
            to: localStorage.getItem('email'),
        }),
    })
    .then(response => response.json())
    .then(data => {
        showToast("",data.message);
    })
    .catch(error => {
        console.error('Error cancelling notifications:', error);
        showToast("Fail","Error cancelling notifications");
    });

    showNotification = false;

});


// Gắn sự kiện cho nút Filter
document.addEventListener("DOMContentLoaded", async() => {

    
    document.getElementById("filter_button").addEventListener("click", filterEvents);
    // Set today's date
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Set the default time filter to "week"

    document.getElementById('time').value = 'week';


    await getProjectsFromDatabase();

    // Click the filter button
    filterEvents();

    document.getElementById("notify_days").value = localStorage.getItem("notify_days") || 1;
    document.getElementById("notify_time").value = localStorage.getItem("notify_time") || "08:00";

    // Schedule notifications
    if(showNotification) {
    setInterval(scheduleNotifications, 60000); // 1 phút
    }
});
