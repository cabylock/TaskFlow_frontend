const currentMonthEl = document.querySelector('.current-month');
const calendarDaysEl = document.querySelector('.calendar-days');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const todayBtn = document.querySelector('.today');
const prevYearBtn = document.querySelector('.prev-year');
const nextYearBtn = document.querySelector('.next-year');

let date = new Date();



document.addEventListener('DOMContentLoaded', async function () {
  
  await getProjectsFromDatabase();

  renderCalendar();


});







const renderCalendar = () => {
  calendarDaysEl.innerHTML = '';
  const month = date.getMonth();
  const year = date.getFullYear();

  // Điều chỉnh để Thứ Hai là ngày đầu tuần
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Điều chỉnh offset

  const lastDate = new Date(year + 2, month + 1, 0).getDate();

  currentMonthEl.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    const paddingDay = document.createElement('div');
    paddingDay.classList.add('padding-day');
    calendarDaysEl.appendChild(paddingDay);
  }

  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement('div');
    day.classList.add('month-day');

    if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
      day.classList.add('current-day');
    }
    Tasks.forEach((event) => {

     const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      if (i === startDate.getDate() && month === startDate.getMonth() && year === startDate.getFullYear()) {
        day.classList.add('event-start-day');

        day.addEventListener('click', () => {
          const selectedDate = new Date(Date.UTC(year, month, i));
          document.getElementById('date').value = selectedDate.toISOString().split('T')[0]; // Chỉ lấy ngày, bỏ giờ phút giây
          document.getElementById('time').value = 'week';
          filterEvents();
          document.getElementById('dashboard_main').style.display = 'none';
          document.getElementById('notification_main').style.display = 'flex';
        });

      }
      if (i === endDate.getDate() && month === endDate.getMonth() && year === endDate.getFullYear()) {
        day.classList.add('event-end-day');

        day.addEventListener('click', () => {
          const selectedDate = new Date(Date.UTC(year, month, i));
          document.getElementById('date').value = selectedDate.toISOString().split('T')[0]; // Chỉ lấy ngày, bỏ giờ phút giây
          document.getElementById('time').value = 'week';
          filterEvents();
          document.getElementById('dashboard_main').style.display = 'none';
          document.getElementById('notification_main').style.display = 'flex';
        });

      }
      if (i === startDate.getDate() && month === startDate.getMonth() && year === startDate.getFullYear() && i === endDate.getDate() && month === endDate.getMonth() && year === endDate.getFullYear()) {
        day.classList.add('event-both-day');

        day.addEventListener('click', () => {
          const selectedDate = new Date(Date.UTC(year, month, i));
          document.getElementById('date').value = selectedDate.toISOString().split('T')[0]; // Chỉ lấy ngày, bỏ giờ phút giây
          document.getElementById('time').value = 'week';
          filterEvents();
          document.getElementById('dashboard_main').style.display = 'none';
          document.getElementById('notification_main').style.display = 'flex';
        });


      }









    });




    day.textContent = i;
    calendarDaysEl.appendChild(day);
  }
};


const navigateMonth = (direction) => {
  date.setMonth(date.getMonth() + direction);
  renderCalendar();
};

const navigateYear = (direction) => {
  date.setFullYear(date.getFullYear() + direction);
  renderCalendar();
};

prevBtn.addEventListener('click', () => navigateMonth(-1));
nextBtn.addEventListener('click', () => navigateMonth(1));
prevYearBtn.addEventListener('click', () => navigateYear(-1));
nextYearBtn.addEventListener('click', () => navigateYear(1));
todayBtn.addEventListener('click', () => {
  date = new Date();
  renderCalendar();
});



