function initLogin() {
    loadSavedData();
    // checkRemember();
}

/**
 * starts when clicked on "sign up"-button on log in screen
 * opens "sign up"-page
 */
function openSignUp() {
    let content = document.getElementById('content-sign-up');
    content.innerHTML = ``;
    content.innerHTML = signUpHTML();
}


/**
 * starts when clicked on return-arrow on "sign up"- and "forgot my password"-page
 * opens "log in"-page
 */
function openLogIn() {
    let content = document.getElementById('content-sign-up');
    content.innerHTML = ``;
    content.innerHTML = logInHTML();
    loadSavedData();
}


/**
 * starts when clicked on "forgot my password"-text on log in page
 * opens "forgot password"-page
 */
function openForgotPassword() {
    let content = document.getElementById('content-sign-up');
    content.innerHTML = ``;
    content.innerHTML = passwordHTML();
}


/**
 * starts when clicked on "log in"-button on "log in"-page
 * values if data matches with data of a user
 * yes: opens users summary
 * no: informs that password is wrong
 */
function login() {
    let email = document.getElementById('email-login');
    let password = document.getElementById('password-login');
    let loggedUser = users.find(u => u.email == email.value && u.password == password.value);
    if (loggedUser) {
        localStorage.setItem('logged User', JSON.stringify(loggedUser));
        setRemember(email, password);

        window.location.href = 'summary.html'; //Weiterleitung auf summary des Nutzers!
    } else {
        document.getElementById('wrong-password').classList.remove('invisible');
        password.value = ``;
        password.placeholder = 'Ups! Try again';
    }
}

/** save date in localStorage if rememberMe is checked*/
function setRemember(email, password) {
    if (document.getElementById('checkbox').checked) {
        localStorage.user = email.value;
        localStorage.password = password.value;
        localStorage.checkbox = 'rememberMe'
    } else {
        localStorage.removeItem('user');
        localStorage.removeItem('password');
        localStorage.removeItem('checkbox');
    }
    password.value = '';
    password.email = '';
}


/**
 * starts when clicked on "Guest Log in"-Button
 * directs to the "summary"-page
 */
function guestLogin() {
    document.getElementById('checkbox').checked = false;
    localStorage.removeItem('user');
    localStorage.removeItem('password');
    localStorage.removeItem('checkbox');
    localStorage.removeItem('logged User');
    document.getElementById('email-login').value = '';
    document.getElementById('password-login').value = '';
    window.location.href = 'summary.html';
}


/**
 * starts when clicked in password-input-field
 * changes the background image from "key" to "invisible", if input type "password" (default)
 * leaves the background image "visible", if input type "text"
 */
function changeBI() {
    let input = document.getElementById('password-login');
    if (input.type === 'password') {
        input.style = 'background-image: url(./assets/img/invisible.png)';
    } else {
        input.style = 'background-image: url(./assets/img/visible.png)';
    }
    // createBox(input);
}


/**
 * creates a clickable boxes over background image
 * click-me: box over image "invisible"
 * click-me-two: box over image "visable"
 */
function createBox(input) {
    if (input.type === 'password') {
        // document.getElementById('click-me').classList.remove('');
        // document.getElementById('click-me-two').classList.add('');
    } else {
        // document.getElementById('click-me').classList.add('');
        // document.getElementById('click-me-two').classList.remove('');
    }
}


/**
 * starts when clicked on background-image "invisible"
 * makes password visible
 */
function visiblePassword() {
    document.getElementById('password-login').style = 'background-image: url(./assets/img/visible.png)';
    document.getElementById('password-login').type = 'text';
    document.getElementById('click-me').classList.add('d-none');
    document.getElementById('click-me-two').classList.remove('d-none');
}


/**
 * starts when clicked on background-image "visible"
 * makes password invisible
 */
function invisiblePassword() {
    document.getElementById('password-login').style = 'background-image: url(./assets/img/invisible.png)';
    document.getElementById('password-login').type = 'password';
    document.getElementById('click-me').classList.remove('d-none');
    document.getElementById('click-me-two').classList.add('d-none');
}


/**
 * starts when activate checkbox
 * saves values from input (email and password) in local storage
 * shows a clickable box
 */
function rememberMe() {
    let email = document.getElementById('email-login').value;
    let password = document.getElementById('password-login').value;
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    document.getElementById('uncheck').classList.remove('d-none');
}


/**
 * starts when deactivate checkbox
 * deletes email and password from local storage
 * cleares inputfields
 * hide the clickable box
 */
function dontRememberMe() {
    let checkbox = document.getElementById('checkbox');
    let email = document.getElementById('email-login');
    let password = document.getElementById('password-login');
    localStorage.removeItem('email');
    email.value = ``;
    localStorage.removeItem('password');
    password.value = ``;
    checkbox.checked = false;
    // document.getElementById('uncheck').classList.add('d-none');
}


/**
 * loads email and password from local storage if there is any
 * marks checkbox as checked
 * shows the clickable box
 */
function loadSavedData() {
    let email = localStorage.user;
    let password = localStorage.password;
    let checkbox = localStorage.checkbox;

    if (checkbox === "rememberMe") {
        document.getElementById('checkbox').checked = true;
        document.getElementById('email-login').value = email;
        document.getElementById('password-login').value = password;
    } else {
        document.getElementById('checkbox').checked = false;
        document.getElementById('email-login').value = ``;
        document.getElementById('password-login').value = ``;
    }
}