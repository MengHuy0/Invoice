// Login/Registration Popup Control
const btnPopup = document.querySelector('.btnLogin-popup');
const cover_box = document.querySelector('.cover_box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const iconClose = document.querySelector('.icon-close');

// Activate/deactivate the cover box
function activateCoverBox() {
   event.preventDefault();
   cover_box.classList.add('active');
}

function deactivateCoverBox() {
    cover_box.classList.remove('active');
}

// Open/close the popup
function activePopup() {
    cover_box.classList.add('active-popup');
}

function deactivateCoverPopup() {
    cover_box.classList.remove('active-popup');
}

// Event listeners
registerLink.addEventListener('click', activateCoverBox);
loginLink.addEventListener('click', deactivateCoverBox);
btnPopup.addEventListener('click', activePopup);
iconClose.addEventListener('click', deactivateCoverPopup);

// Image Slider
const slides = document.querySelectorAll(".slides img");
let slideIndex = 0;
let intervalId = null;

document.addEventListener("DOMContentLoaded", initializeSlider);

function initializeSlider() {
    if (slides.length > 0) {
        slides[slideIndex].classList.add("displaySlide");
        intervalId = setInterval(nextSlide, 5000);  // Change the slide every 5 seconds
    }
}

function showSlide(index) {
    if (index >= slides.length) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = slides.length - 1;
    }

    slides.forEach(slide => {
        slide.classList.remove("displaySlide");
    });

    slides[slideIndex].classList.add("displaySlide");
}

function prevSlide() {
    clearInterval(intervalId);
    slideIndex--;
    showSlide(slideIndex);
}

function nextSlide() {
    slideIndex++;
    showSlide(slideIndex);
}

//////////
document.addEventListener('DOMContentLoaded', () => {
    const loginPopup = document.querySelector('.btnLogin-popup');
    const closeIcon = document.querySelector('.icon-close');
    const loginForm = document.querySelector('.form-box.login');
    const registerForm = document.querySelector('.form-box.register');
    const registerLink = document.querySelector('.register-link');
    const loginLink = document.querySelector('.login-link');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.querySelector('.form-box.register .btn');

    // Handle Login
    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log('result', result);
    
        if (response.ok) {
           
            localStorage.setItem('authToken',JSON.stringify(result.token));
            // Redirect or store the JWT token in local storage/session
            window.location.href = "invoicePage.html"; 
        } else {
            alert(result.message || 'Login failed!');
        }
    });

    // Handle Register
    registerBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const username = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;

        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
           return loginLink.click();
        } else {
            alert(result.message || 'Registration failed!');
        }
    });
});


//////////////////////////////////////////////////////////////////////////////////////
