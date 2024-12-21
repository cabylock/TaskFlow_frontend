



document.getElementById('uploadButton').addEventListener('click', function() {
   
   
   document.getElementById('profileInput').click(); // Mở hộp thoại chọn file
});

document.getElementById('profileInput').addEventListener('change', function(event) {
   const file = event.target.files[0];
   if (file && file.type.startsWith('image/') ) {
       const formData = new FormData();
       
         formData.append('file', file);
         formData.append('folder', 'profile');
            fetch('https://back-end-ocean.up.railway.app/storage/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result) {
                    document.getElementsByClassName('profileImage').src = `${result.url}`;
                } else {
                    alert('Error uploading profile image');
                }
            })
            

   }
});

document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    
    const name = document.getElementById('new_name').value;
    const password = document.getElementById('new_password').value;
    const profileImage = document.getElementsByClassName('profileImage').src;
    const description = document.getElementById('description').value;

    if(name === '')
    {
        return;
    }
    document.getElementById('name').innerText = name;
    


    const new_profile = {}; 
    new_profile.name = name;
    new_profile.password = password;
    new_profile.profile_image = profileImage;
    new_profile.description = description;
    new_profile.username = localStorage.getItem('username');

    
    fetch('https://back-end-ocean.up.railway.app/user/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_profile)
    })
    .then(response => response.json())
    .then(result => {
        if(result)
        {
            showToast('Profile updated successfully');
            
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error connection');
    });

   
});

