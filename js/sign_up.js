setURL('https://stefan-heinemann.developerakademie.net/smallest_backend_ever');

async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('allUsers')) || []; //füllt das leere array users mit den daten vom server
    loadSavedData();
}


/**
 * pushes a new user to the user array
 * uses the filled in name, email, password from the input-fields
 */
async function addToUsers() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    userId = users.length;

    let newUser = {
        'name': name.value,
        'email': email.value,
        'password': password.value,
        'id': userId
    };

    users.push(newUser);
    name.value = ``;
    email.value = ``;
    password.value = ``;

    await backend.setItem('allUsers', JSON.stringify(users)); //speichert die daten auf dem server
    window.location.href = 'index.html';
}