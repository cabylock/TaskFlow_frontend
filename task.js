let Tasks =  [];
let number_running =0 ;
let number_ended = 0;
let number_coming = 0;
let number_total = 0;

// Lấy các phần tử HTML
const taskMain = document.getElementById('task_main');
const projectNameInput = document.getElementById('project_name');
const addProjectButton = document.getElementById('add_project_button');
const projectList = document.querySelector('.project_list');
const progressFilter = document.getElementById('progress_filter');
const levelFilter = document.getElementById('level_filter');
document.addEventListener('DOMContentLoaded', async() => {
  

  
  
  await getProjectsFromDatabase() // Lấy dữ liệu từ database
  
  renderProjectList(); // Hiển thị danh sách dự án
  renderOverviewStatistics(); // Hiển thị thống kê
  
  // Lắng nghe sự kiện click nút Add Project
  addProjectButton.addEventListener('click', addProject);
  
  // Lắng nghe sự kiện thay đổi bộ lọc
  progressFilter.addEventListener('change', renderProjectList);
  levelFilter.addEventListener('change', renderProjectList);
  
});
  

  // Hàm định dạng ngày thành YYYY-MM-DD
  function formatDate(date) {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  // Hàm thêm dự án mới
  function addProject() {
    const projectName = projectNameInput.value.trim();
    if (projectName) {
      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);
      const newProject = {
        name: projectName,
        startDate: formattedDate,
        endDate: formattedDate,
        level: 'low',
        note: '',
        files: [], // Danh sách file sẽ lưu trữ { name, url }
      };

      Tasks.push(newProject);
      projectNameInput.value = '';
      renderProjectList();
      
    }
  }

  function showLoadingSpinner(spinnerElement) {
    spinnerElement.style.display = 'inline-block';
  }
  
  function hideLoadingSpinner(spinnerElement) {
    spinnerElement.style.display = 'none';
  }
  

  // Hàm hiển thị danh sách dự án
  function renderProjectList() {
    const progressValue = progressFilter.value;
    const levelValue = levelFilter.value;
    const currentDate = new Date();
    projectList.innerHTML = '';
    
    Tasks.forEach((project, projectIndex) => {
      const projectStartDate = new Date(project.startDate);
      const projectEndDate = new Date(project.endDate);
      let showProject = true;
      
      number_total++;
      if(project.level === 'high')
        {
          number_running++;
        }
        else if(project.level === 'medium')
        {
          number_ended++;
        }
        else if(project.level === 'low')
        {
          number_comming++;
        }

      if( progressValue === 'Running' && (currentDate < projectStartDate || currentDate > projectEndDate)) {
        showProject = false;
      } 
      else if (progressValue === 'Ended' && currentDate < projectEndDate) {
        showProject = false;
      }
      else if (progressValue === 'Comming'   && currentDate > projectStartDate) {
        showProject = false;
      }
      else if( levelValue !== 'all' && project.level !== levelValue) {
        showProject = false;
      }
      else 
      {
        showProject = true;

       
      }

      

      if (showProject) {
        const projectItem = document.createElement('div');
        projectItem.classList.add('project_item');
        projectItem.setAttribute('data-level', project.level);
        projectItem.innerHTML = `
          <div class="project-header">
            <h2 class="project-name" contenteditable="true">${project.name}</h2>
            <div class="project-controls">
              <div class="project-details">
                <label for="level-${projectIndex}">Level:</label>
                <select id="level-${projectIndex}" class="level-select" onchange="this.parentElement.parentElement.parentElement.parentElement.setAttribute('data-level', this.value)">
                  <option value="high" ${project.level === 'high' ? 'selected' : ''}>High</option>
                  <option value="medium" ${project.level === 'medium' ? 'selected' : ''}>Med</option>
                  <option value="low" ${project.level === 'low' ? 'selected' : ''}>Low</option>
                </select>
              </div>
              <button class="delete-button">🗑️</button>
            </div>
          </div>
          <div class="project-dates">
            <label for="start-date-${projectIndex}">Start Date:</label>
            <input type="date"   id="start-date-${projectIndex}" class="start-date" value="${project.startDate || ''}">
            <label for="end-date-${projectIndex}">End Date:</label>
            <input type="date"   id="end-date-${projectIndex}" class="end-date" value="${project.endDate || ''}">
          </div>
          <div class="project-note">
            <label for="note-${projectIndex}">Note:</label>
            <textarea id="note-${projectIndex}" class="note-input">${project.note || ''}</textarea>
          </div>
          <div class="project-upload">
            <div class="file-upload-wrapper">
              <input type="file" id="file-upload-${projectIndex}" class="file-upload" multiple />
              <span class="custom-file-label">Choose Files</span>
              <div id="loading-spinner-${projectIndex}" class="loading-spinner" style="display: none;"></div>
            </div>
            <div class="file-list">
            ${project.files.map((file, fileIndex) => renderFileItem(file, projectIndex, fileIndex)).join('')}
            </div>
          </div>
          <button class="save-button">Save</button>
        `;
        projectList.appendChild(projectItem);

        // Xử lý upload file
        projectItem.querySelector('.file-upload').addEventListener('change', async (e) => {
          const uploadedFiles = Array.from(e.target.files);
          const spinnerElement = document.getElementById(`loading-spinner-${projectIndex}`);
          showLoadingSpinner(spinnerElement);
          try {
            const uploadedLinks = await Promise.all(uploadedFiles.map(uploadFileToAPI));
            uploadedFiles.forEach((file, i) => {
              project.files.push({ name: file.name, filepath: uploadedLinks[i], filetype: file.type, filename: file.name });
            });
            
            saveProjectsToDatabase(); // Cập nhật database
            renderProjectList(); // Cập nhật lại danh sách dự án sau khi upload
          } catch (error) {
            alert('Failed to upload one or more files');
          }
          finally {
            hideLoadingSpinner(spinnerElement);
          }
        });

        // Xử lý sự kiện thay đổi tên dự án
       projectItem.querySelector('.project-name').addEventListener('input', (e) => {
          project.name = e.target.innerText;
          saveProjectsToDatabase(); // Cập nhật database
          showToast("Thay đổi thành công");
        });

        // Xử lý sự kiện thay đổi level
        projectItem.querySelector('.level-select').addEventListener('change', (e) => {
          project.level = e.target.value;
          saveProjectsToDatabase(); // Cập nhật database
          showToast("Thay đổi thành công");
        });


        // Xử lý nút Save
        projectItem.querySelector('.save-button').addEventListener('click', () => {
          project.note = projectItem.querySelector('.note-input').value;
          project.level = projectItem.querySelector('.level-select').value;
          project.startDate = projectItem.querySelector('.start-date').value;
          project.endDate = projectItem.querySelector('.end-date').value;
          saveProjectsToDatabase(); // Cập nhật database
          showToast("Thay đổi thành công");
          // renderProjectList();
        });

        // Xử lý nút Delete
        projectItem.querySelector('.delete-button').addEventListener('click', () => {
          Tasks.splice(projectIndex, 1);
          renderProjectList();
          saveProjectsToDatabase(); // Cập nhật database
          showToast("Thay đổi thành công");
        });

        // Xử lý nút Delete File
        projectItem.querySelectorAll('.delete-file-button').forEach(button => {
          button.addEventListener('click', async (e) => {
            const projectIndex = e.target.getAttribute('data-project-index');
            const fileIndex = e.target.getAttribute('data-file-index');
            

            try {
              
              Tasks[projectIndex].files.splice(fileIndex, 1);
              saveProjectsToDatabase(); // Cập nhật database
              renderProjectList(); // Cập nhật lại danh sách dự án sau khi xóa file
              showToast("Thay đổi thành công");
            } catch (error) {
              alert('Failed to delete file');
            }
          });
        });
      }
    });
  }

  

  // upload file to API
  async function uploadFileToAPI(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'projects'); // Thư mục lưu trữ file

    try {
      const response = await fetch('https://back-end-ocean.up.railway.app/storage/upload', { // Thay bằng API upload của bạn
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      const result = await response.json();
      return result.url; // Trả về URL của file đã upload
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  // Hàm lấy dữ liệu từ database
  async function getProjectsFromDatabase() {
    const username = localStorage.getItem('username'); // Lấy username từ localStorage

    const response = await fetch('https://back-end-ocean.up.railway.app/project/get', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    Tasks = data.content.Tasks || [];
  }

  // Hàm lưu dự án vào database
  async function saveProjectsToDatabase() {
    const username = localStorage.getItem('username'); // Lấy username từ localStorage

    fetch('https://back-end-ocean.up.railway.app/project/update', { // Thay '/api/save-Tasks' bằng URL của API backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, Tasks }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Project created successfully' || data.message === 'Project updated successfully') {
          
        }
      })
      .catch(error => {
        console.error('Failed to save Tasks:', error);
      });
  }
  function truncateFilename(filename, maxLength = 8) {
    if (filename.length > maxLength) {
      return filename.substring(0, maxLength) + '...';
    }
    return filename;
  }
  
  function renderFileItem(file, projectIndex, fileIndex) {
    if (!file || !file.filetype) {
      return `
        <div class="file-item">
          <div class="file-icon unknown"></div>
          <span class="file-name" title="${file.name || 'Unknown file'}">
            <a href="${file.filepath || '#'}" target="_blank">${truncateFilename(file.name || 'Unknown file')}</a>
          </span>
          <button class="delete-file-button" data-project-index="${projectIndex}" data-file-index="${fileIndex}">🗑️</button>
        </div>`;
    }
  
    if (file.filetype.startsWith('image/')) {
      return `
        <div class="file-item">
          <a href="${file.filepath}" target="_blank">
            <img src="${file.filepath}" alt="${file.filename}" class="file-thumbnail" title="${file.filename}" />
          </a>
          <span class="file-name" title="${file.filename}">
            <a href="${file.filepath}" target="_blank">${truncateFilename(file.filename)}</a>
          </span>
          <button class="delete-file-button" data-project-index="${projectIndex}" data-file-index="${fileIndex}">🗑️</button>
        </div>`;
    } else if (file.filetype.startsWith('video/')) {
      return `
        <div class="file-item">
          <a href="${file.filepath}" target="_blank">
            <video controls src="${file.filepath}" title="${file.filename}" class="file-video"></video>
          </a>
          <span class="file-name" title="${file.filename}">
            <a href="${file.filepath}" target="_blank">${truncateFilename(file.filename)}</a>
          </span>
          <button class="delete-file-button" data-project-index="${projectIndex}" data-file-index="${fileIndex}">🗑️</button>
        </div>`;
    } else if (file.filetype === 'application/pdf') {
      return `
        <div class="file-item">
          <a href="${file.filepath}" target="_blank">
            <div class="file-icon-pdf"></div>
          </a>
          <span class="file-name" title="${file.filename}">
            <a href="${file.filepath}" target="_blank">${truncateFilename(file.filename)} (PDF)</a>
          </span>
          <button class="delete-file-button" data-project-index="${projectIndex}" data-file-index="${fileIndex}">🗑️</button>
        </div>`;
    } else {
      return `
        <div class="file-item">
          <div class="file-icon other"></div>
          <span class="file-name" title="${file.filename}">
            <a href="${file.filepath}" target="_blank">${truncateFilename(file.filename)} (${file.filetype})</a>
          </span>
          <button class="delete-file-button" data-project-index="${projectIndex}" data-file-index="${fileIndex}">🗑️</button>
        </div>`;
    }
  }

