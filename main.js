let users = [];
let userId;
let currentUser = [];

async function includeHTML() {
   let includeElements = document.querySelectorAll('[w3-include-html]');
   for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html");
      let resp = await fetch(file);
      if (resp.ok) {
         element.innerHTML = await resp.text();
      } else {
         element.innerHTML = 'Page not found';
      }
   }
}


function setNavActive(id) {
   document.getElementById(id).classList.add('active');
}



// functions used in header-template
/**
 * starts when clicked on log-out in log-out menu
 * deletes logged User data from local storage
 * redirects to index.html
 */
function logOut() {
   localStorage.removeItem('logged User');
   window.location.href = 'index.html';
}


/**
 * starts when clicked on picture in header
 * shows log-out menu
 */
function showMenu() {
   document.getElementById('log-out').classList.remove('d-none');
}


/**
 * closes log-out menu
 */
function closeLogoutMenu() {
   document.getElementById('log-out').classList.add('d-none');
}


/**
 * causes that menu is just closed when clicked on background (not menu itself)
 */
function doNotClose(event) {
   event.stopPropagation();
}


/**
 * starts when clicked on question mark in header
 * opens "help"-page
 */
function openHelp() {
   window.location.href = 'help.html';
}