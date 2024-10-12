let btnLogin = document.querySelector(".btn-search");
let btn = document.querySelector(".search");

btnLogin.addEventListener("click", () => {
    btn.classList.toggle("btn-click");
});

let menu = document.querySelector(".menu-items");
let menubtn = document.querySelector(".menu");

menubtn.addEventListener("click", ()=> {
    menu.classList.toggle("active-menu");
    menubtn.classList.toggle("btn-menu-active")
});


// theme-switcher
document.getElementById('theme-toggle').addEventListener('click', function () {
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Toggle between sun and star icons
    if (themeIcon.src.includes('assets/icons/sun.svg')) {
        themeIcon.src = 'assets/icons/star.svg';  // Switch to dark mode icon (star)
        body.classList.add('dark-mode');  // Add dark mode class to body

    } else {
        themeIcon.src = 'assets/icons/sun.svg';  // Switch back to light mode icon (sun)
        body.classList.remove('dark-mode');  // Remove dark mode class from body
    }
});


//trigger for profile drop down menu

let profileBtn = document.querySelector(".profile-btn");
let profileClass = document.querySelector(".profile");
let profileDropdown = document.querySelector(".profile-dropdown");

profileBtn.addEventListener("click", ()=> {
    profileClass.classList.toggle("active-profile");
    profileDropdown.classList.toggle("active-dropdown");
});


// Nav - active 

// Get all the nav links
const navLinks = document.querySelectorAll('.navs a');

// Get the current page's pathname
const currentPage = window.location.pathname;

// Loop through each link and check if it matches the current URL
navLinks.forEach(link => {
  // Check if the link's href matches the current page
  if (link.href.includes(currentPage)) {
    // Add the active-nav class to the current page's link
    link.classList.add('active-nav');
  }
});


// for login/signup page in small screens
const signupLoginButton = document.getElementById('signup-login-btn');
                
// Add click event listener to the button
signupLoginButton.addEventListener('click', function() {
    // Navigate to log-form.html
    window.location.href = 'log-form.html';
});

// for login/signup page in big screens
const signupLoginButton2 = document.getElementById('signup-login-btn2');
                
// Add click event listener to the button
signupLoginButton2.addEventListener('click', function() {
    // Navigate to log-form.html
    window.location.href = 'log-form.html';
});
