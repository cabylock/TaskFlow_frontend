

document.addEventListener('DOMContentLoaded', function() {
    const showRegisterButton = document.getElementById('showRegister');
    const showLoginButton = document.getElementById('showLogin');
    const registerSection = document.getElementById('registerSection');
    const loginSection = document.getElementById('loginSection');


    document.getElementById('home').addEventListener('click', function() {

        document.getElementById('homeSection').style.display = 'block';
        document.getElementsByClassName('container')[0].style.display = 'none';
        document.getElementById('aboutSection').style.display = 'none';
        document.getElementById('contactSection').style.display = 'none';

    });

    document.getElementById('about').addEventListener('click', function() { 
        document.getElementById('homeSection').style.display = 'none';
        document.getElementById('aboutSection').style.display = 'block';
        document.getElementsByClassName('container')[0].style.display = 'none';
        document.getElementById('contactSection').style.display = 'none';
    });

    document.getElementById('contact').addEventListener('click', function() {
        document.getElementById('homeSection').style.display = 'none';
        document.getElementById('aboutSection').style.display = 'none';
        document.getElementsByClassName('container')[0].style.display = 'none';
        document.getElementById('contactSection').style.display = 'block';
    });


    showRegisterButton.addEventListener('click', function() {
        registerSection.style.display = 'block';
        document.getElementsByClassName('container')[0].style.display = 'block';
        document.getElementById('homeSection').style.display = 'none';
        loginSection.style.display = 'none';
        document.getElementById('aboutSection').style.display = 'none';
        document.getElementById('contactSection').style.display = 'none';

    });

    showLoginButton.addEventListener('click', function() {
        registerSection.style.display = 'none';
        document.getElementById('homeSection').style.display = 'none';
        loginSection.style.display = 'block';
        document.getElementsByClassName('container')[0].style.display = 'block';
        document.getElementById('aboutSection').style.display = 'none';
        document.getElementById('contactSection').style.display = 'none';
    });

    document.getElementById('registerForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const name =username;
        const email = document.getElementById('registerEmail').value;

        fetch('https://back-end-ocean.up.railway.app/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, name })
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message || result);
                if(result.message === 'Register successfully') {
                registerSection.style.display = 'none';
                
                loginSection.style.display = 'block';}
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error connection");
            });
    });

    
   document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        

        fetch('https://back-end-ocean.up.railway.app/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(result => {
                if (result.message === 'Login successfully') {
                    localStorage.setItem('username', result.user.username);
                    
                    window.location.assign('home.html');
                   
                } else {
                    alert(result.message || result);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error connection");
            });
    });

});


function onSignIn(response)
{
      
      const data = response;
     
      
      fetch('https://back-end-ocean.up.railway.app/user/login_google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                localStorage.setItem('username', result.username);
                localStorage.setItem('email', result.email);
                
                window.location.assign('home.html');
                
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error connection");
            });
      
      
}




