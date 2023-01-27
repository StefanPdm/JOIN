setURL('https://stefan-heinemann.developerakademie.net/smallest_backend_ever');

let currentUrl = new URL(window.location.href); //bindet URL der aktuellen Seite an Variable
let email = currentUrl.searchParams.get("email"); // liest Parameter email aus URL heraus
let timestamp = currentUrl.searchParams.get("timestamp");
let timestampMail = timestamp / 60;
let seconds = Date.now() / 1000;
let timestampNow = seconds / 60;
let time = timestampNow - timestampMail


async function initReset() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('allUsers')) || [];
}


/**
 * starts when clicked on "continue"-button on the "reset"-page
 * checks if password-reset-link is younger than 24h
 */
function checkTime() {
    if (time < 1440) {
        checkMail(); //if yes, checkMail function starts
    } else {
        openPopUpTime(); // if no, message "get a new link" pops up and redirecting to index.html
    }
}


/**
 * checks, if mailadress belongs to a user
 */
function checkMail() {
    let sameMail = users.find(u => u.email == email);
    if (sameMail) {
        replacePassword(sameMail); //if yes, replacePassword function starts
    } else {
        openPopUpMail(); // if no, message "Mailadress not assignable" pops up and redirecting to index.html
    }
}


/**
 * replaces password, if entered passwords are the same
 */
async function replacePassword(sameMail) {
    let newPassword = document.getElementById('new-password').value;
    let confirmedPassword = document.getElementById('confirm-password').value;
    if (newPassword === confirmedPassword) {
        sameMail.password = confirmedPassword;
        openPopUpSuccess(); //if yes, message "you reset your password" pops up
    } else {
        openPopUpWriting();//if no, message "writing is different" pops up
    }
    await backend.setItem('allUsers', JSON.stringify(users));
}



// Pop-Up functions
function openPopUpTime() {
    document.getElementById('wrong-time').classList.remove('d-none');
}


function closePopUpTime() {
    document.getElementById('wrong-time').classList.add('d-none');
}


function openPopUpMail() {
    document.getElementById('wrong-mail').classList.remove('d-none');
}


function closePopUpMail() {
    document.getElementById('wrong-mail').classList.add('d-none');
    window.location.href = 'index.html';
}


function openPopUpSuccess() {
    document.getElementById('reset-success').classList.remove('d-none');
}


function closePopUpSuccess() {
    document.getElementById('reset-success').classList.add('d-none');
    window.location.href = 'index.html';
}


function openPopUpWriting() {
    document.getElementById('wrong-writing').classList.remove('d-none');
}


function closePopUpWriting() {
    document.getElementById('wrong-writing').classList.add('d-none');
}
