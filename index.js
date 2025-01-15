const btnPopup = document.querySelector('.btnLogin-popup');
const cover_box = document.querySelector('.cover_box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const iconClose = document.querySelector('.icon-close');
function activateCoverBox() {
   event.preventDefault();
    cover_box.classList.add('active');
};
function deactivateCoverBox() {
    cover_box.classList.remove('active');
};
function activePopup() {
    cover_box.classList.add('active-popup');
};
function deactivateCoverPopup() {
    cover_box.classList.remove('active-popup');
};
registerLink.addEventListener('click', activateCoverBox);
loginLink.addEventListener('click', deactivateCoverBox);
btnPopup.addEventListener('click', activePopup);
iconClose.addEventListener('click', deactivateCoverPopup);


// img slider
const slides = document.querySelectorAll(".slides img")
let slideIndex = 0;
let intervalId = null;

document.addEventListener("DOMContentLoaded", initializeSlider)
function initializeSlider(){
    if(slides.length >0){
    slides[slideIndex].classList.add("displaySlide");
    intervalId = setInterval(nextSlide, 5000)
}
}
function showSlide(index){
    if(index >= slides.length){
        slideIndex = 0;
    }
    else if(index <0){
        slideIndex = slides.length - 1;
    }
    slides.forEach(slides => {
    slides.classList.remove("displaySlide")
});
slides[slideIndex].classList.add("displaySlide");
}
function prevSlide(){
    clearInterval(intervalId)
slideIndex--;
showSlide(slideIndex);
}
function nextSlide(){
slideIndex++;
showSlide(slideIndex);
}