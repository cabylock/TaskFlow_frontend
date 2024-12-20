// DOM Elements
const playlistContainer = document.querySelector('.playlist_container');
const playlistNameInput = document.getElementById('playlist_name');
const addPlaylistButton = document.getElementById('add_playlist_button');

// Mảng lưu playlist
let playlists = [];

// Hàm thêm video mới vào DOM mà không render lại toàn bộ playlist
function addVideoToPlaylist(playlistIndex, video) {
    const videosList = playlistContainer.querySelectorAll('.playlist')[playlistIndex].querySelector('.playlist-videos');

    // Tạo phần tử video mới
    const videoItem = document.createElement('li');
    videoItem.innerHTML = `
        <h3 contenteditable="true" data-playlist-index="${playlistIndex}" data-video-index="${playlists[playlistIndex].videos.length - 1}" >${video.name}</h3>
        <button class="remove-video-button" data-playlist-index="${playlistIndex}" data-video-index="${playlists[playlistIndex].videos.length - 1}">X</button>
        ${video.type === 'mp3'
            ? `<audio controls>
                       <source src="${video.source}" type="audio/mp3">
                   </audio>`
            : `<iframe width="400" height="200" src="${video.source}" frameborder="0" allow="" encrypted-media" allowfullscreen></iframe>`
        }
    `;

    // Sự kiện xóa video
    const removeVideoButton = videoItem.querySelector('.remove-video-button');
    removeVideoButton.addEventListener('click', function () {
        const playlistIndex = this.getAttribute('data-playlist-index');
        const videoIndex = this.getAttribute('data-video-index');
        playlists[playlistIndex].videos.splice(videoIndex, 1); // Xóa video khỏi mảng
        videoItem.remove(); // Xóa phần tử DOM
        update_database();
        showToast('Xóa video thành công');
    });

    // edit tên video
    const videoNameElement = videoItem.querySelector('h3');
    videoNameElement.addEventListener('blur', function () {
        const playlistIndex = parseInt(this.getAttribute('data-playlist-index'), 10);
        const videoIndex = parseInt(this.getAttribute('data-video-index'), 10);

        // Cập nhật tên video trong mảng
        if (Number.isInteger(playlistIndex) && Number.isInteger(videoIndex)) {
            playlists[playlistIndex].videos[videoIndex].name = this.textContent.trim();
            update_database(); // Cập nhật database
            showToast('Cập nhật tên video thành công');         
        } else {
            console.error('Invalid playlistIndex or videoIndex');
        }
    });

    // Thêm video vào danh sách hiển thị
    videosList.appendChild(videoItem);
}

function renderPlaylists() {
    playlistContainer.innerHTML = ''; // Xóa nội dung cũ trước khi render

    playlists.forEach((playlist, index) => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'playlist';
        playlistElement.setAttribute('data-index', index);

        // Header playlist
        playlistElement.innerHTML = `
            <div class="playlist-header">
                <h2 contenteditable="true">${playlist.name}</h2>
                <button class="remove-playlist-button" data-index="${index}">Remove</button>
            </div>
            <div class="playlist-inputs">
                <button class="upload-video-button" data-index="${index}">Upload Music</button>
                <input type="text" class="video-link-input" placeholder="Enter video link">
                <button class="add-link-button" data-index="${index}">Add Link</button>
            </div>
            <ul class="playlist-videos" data-index="${index}"></ul>
        `;


        // Sự kiện edit tên playlist
        const playlistNameElement = playlistElement.querySelector('h2');
        playlistNameElement.addEventListener('blur', function () {
            const index = this.parentElement.parentElement.getAttribute('data-index');
            playlists[index].name = this.textContent.trim();
            update_database(); // Cập nhật database
            showToast('Cập nhật tên playlist thành công');
        });

        // Xử lý xóa playlist
        const removePlaylistButton = playlistElement.querySelector('.remove-playlist-button');
        removePlaylistButton.addEventListener('click', function () {
            playlists.splice(index, 1); // Xóa playlist khỏi mảng
            playlistElement.remove(); // Xóa playlist khỏi DOM
            update_database(); // Cập nhật database
            showToast('Xóa playlist thành công');
        });

        // Xử lý upload video
        const uploadVideoButton = playlistElement.querySelector('.upload-video-button');
        uploadVideoButton.addEventListener('click', function () {
            const uploadInput = document.createElement('input');
            uploadInput.type = 'file';
            uploadInput.accept = '.mp3,.mp4'; // Chấp nhận các tệp video// audio mp3
            uploadInput.addEventListener('change', async function (event) {
                const file = event.target.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('folder', 'video');

                    try {
                        showToast('Đang upload video');
                        const response = await fetch('https://back-end-ocean.up.railway.app/storage/upload', {
                            method: 'POST',
                            body: formData,
                        });
                        
                        
                        if (!response.ok) {
                            showToast('Lỗi upload video');

                        }

                        const result = await response.json();
                        const fileType = file.name.endsWith('.mp3') ? 'mp3' : 'link';
                        const newVideo = {
                            type: fileType,
                            name: file.name,
                            source: result.url, // Sử dụng liên kết từ API
                        };

                        playlists[index].videos.push(newVideo);
                        addVideoToPlaylist(index, newVideo); // Thêm video mới vào DOM
                        update_database(); // Cập nhật database
                    } 
                    catch (error) {
                       
                        showToast('Lỗi upload video');
                    }
                    finally {
                        showToast('Upload video thành công');
                    }
                }
            });
            uploadInput.click();
        });

        // Xử lý thêm video từ link
        const addLinkButton = playlistElement.querySelector('.add-link-button');
        addLinkButton.addEventListener('click', function () {
            const linkInput = playlistElement.querySelector('.video-link-input');
            const videoLink = linkInput.value.trim();
            if (videoLink) {
                const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
                const videoIdMatch = youtubeRegex.exec(videoLink);

                let newVideo;
                if (videoIdMatch) {
                    const videoId = videoIdMatch[1];
                    newVideo = {
                        type: 'link',
                        name: `YouTube Video (${videoId})`,
                        source: `https://www.youtube.com/embed/${videoId}`,
                    };
                } else {
                    newVideo = {
                        type: 'link',
                        name: videoLink.split('/').pop(),
                        source: videoLink,
                    };
                }

                playlists[index].videos.push(newVideo);
                addVideoToPlaylist(index, newVideo); // Thêm video mới vào DOM
                linkInput.value = ''; // Reset input
                update_database(); // Cập nhật database
            }
        });

        // Thêm playlist vào DOM
        playlistContainer.appendChild(playlistElement);

        // Render video trong playlist này
        playlist.videos.forEach((video) => addVideoToPlaylist(index, video));
    });
}





// Thêm playlist mới
addPlaylistButton.addEventListener('click', function () {
    const playlistName = playlistNameInput.value.trim();
    if (playlistName) {
        playlists.push({ name: playlistName, videos: [] }); // Thêm playlist mới
        playlistNameInput.value = ''; // Xóa nội dung input
        renderPlaylists(); // Render lại giao diện
    } 
    else {
        console.log('Please enter playlist name');
        showToast('Please enter playlist name');
    }
});

// Render danh sách playlist khi tải trang
document.addEventListener('DOMContentLoaded', async function () {

    let username = localStorage.getItem('username');

    fetch(`https://back-end-ocean.up.railway.app/video/get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
    })
        .then(response => response.json())
        .then(data => {

            playlists = data.content.playlists;

            renderPlaylists();
        });




}
);


function update_database() {
    let username = localStorage.getItem('username');
    fetch(`https://back-end-ocean.up.railway.app/video/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, playlists: playlists }),
    })

}
