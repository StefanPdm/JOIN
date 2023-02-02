"use strict";

setURL('https://stefan-heinemann.developerakademie.net/smallest_backend_ever');
let allUsers = [];
let allUsersAlpha = [];
let firstNameLetters = [];
let ringColorList = [];
let fullValidation = false;
let currentEditID;

/**
 * load data from Server,
 * set arrays, include Header and Navbar,
 * set active menu button,
 * render contact list
 */
async function initContacts() {
  await downloadFromServer();
  allUsers = JSON.parse(backend.getItem('allUsers')) || [];
  allUsersAlpha = JSON.parse(backend.getItem('allUsers')) || [];
  await includeHTML();
  setNavActive('navContact');
  getLoggedUser();
  setNameListAlpha();
  setRingColorList();
  renderContactList();
}

/**
 * includeHTML
 */
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

/**
 * get active user
 */
function getLoggedUser() {
  currentUser = JSON.parse(localStorage.getItem('logged User') || '9999');
  if (currentUser == '9999') {
    return;
  } else {
    document.getElementById('headerUserImg').src = "./assets/img/header/christina.png";
  }
}

/**
 * open active contact from contact list
 */
function openContact(id) {
  renderContactList();
  document.getElementById(id).classList.add('active-user');
  showContactDetails(id)
  if (window.innerWidth < 1090) {
    document.getElementById('contacts-list-container').classList.add('d-none');
    document.getElementById('contacts-show-main-container').classList.add('showImportant');
    document.getElementById('new-contact-button').classList.add('d-none');
    document.getElementById('contacts-show-detail-container').innerHTML += `<div class="back-arrow" onclick="closeContact(${id})"><--</div>`;
  };
}

function closeContact(id) {
  document.getElementById('contacts-list-container').classList.remove('d-none');
  document.getElementById('contacts-show-main-container').classList.remove('showImportant');
  document.getElementById('new-contact-button').classList.remove('d-none');
  showContactDetails(id);
}

/**
 * show contact details
 */
function showContactDetails(id) {
  let element = document.getElementById('contacts-show-detail-container');
  id = id * 1;
  let userArrayIndex = allUsersAlpha.findIndex(x => x.id === id);
  let initials = getInitials(allUsersAlpha[userArrayIndex].name);
  renderContactDetails(element, userArrayIndex, initials);

}

/**
 * render contact details
 */
function renderContactDetails(element, userArrayIndex, initials) {
  element.innerHTML = /*html*/ `<!-- content headline -->
          <div class="contact-detail-headline">
            <div style="background-color: ${allUsersAlpha[userArrayIndex].ringColor}" class="letter-ring-big">${initials}</div>
            <div class="detail-name-container">
              <div class="detail-name">${allUsersAlpha[userArrayIndex].name}</div>
              <div class="cursor-pointer text-16-400-blue" onclick="toggleAddContainer()">+ Add Task</div>
            </div>
          </div>
          <!-- edit container -->
          <div class="contact-detail-edit-container" id="contact-detail-edit-container">
            <div class="contact-detail-title text-21-400-black">Contact Information</div>
            <div class="contact-edit-item-container" onclick="openEditContainer(${allUsersAlpha[userArrayIndex].id})">
              <svg width="21" height="30" viewBox="0 0 21 30" fill="#2A3647">
                <path d="M2.87121 22.0156L7.69054 24.9405L20.3337 4.10842
                  C20.6203 3.63628 20.4698 3.02125 19.9977 2.73471L16.8881 0.847482
                  C16.4159 0.56094 15.8009 0.711391 15.5144 1.18353L2.87121 22.0156Z" />
                <path d="M2.28614 22.9794L7.10547 25.9043L2.37685 28.1892L2.28614 22.9794Z" />
              </svg>
              <div>Edit Contact</div>
            </div>
          </div>
          <!-- detail information container -->
          <div class="contacts-details-container text-16-700-black">
            <div class="contacts-detail-item">
              <div>Email</div>
              <div class="text-16-400-blue">${allUsersAlpha[userArrayIndex].email}</div>
            </div>
            <div class="contacts-detail-item">
              <div>Phone</div>
              <div class="text-16-400-black">${allUsersAlpha[userArrayIndex].phone}</div>
            </div>
          </div><!-- add button -->
          <!-- <div class="button text-21-700-black" onclick="toggleEditContainer()">
            <div>New contact</div>
            <div><img src="./assets/img/contacts/new-contact.png" alt=""></div>
          </div> -->
          `;
}

/**
 * start rendering for contact list
 */
function renderContactList() {
  findFirstNameLetter();
  includeListHTML();
}

/**sort allUsers array alphabetical */
function setNameListAlpha() {
  allUsersAlpha = allUsersAlpha.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * create list of firstname letters of all active users 
 */
function findFirstNameLetter() {
  firstNameLetters = [];
  for (let i in allUsersAlpha) {
    let firstLetter = allUsersAlpha[i].name.charAt(0).toUpperCase();
    if (!firstNameLetters.includes(firstLetter)) {
      firstNameLetters.push(firstLetter);
    }
  }
}
/** get initials for color ring */
function getInitials(fullname) {
  return (getFirstLetter(fullname) + getSecondLetter(fullname));
}

/** get first letter of name */
function getFirstLetter(fullname) {
  return fullname.charAt(0).toUpperCase();
}

/** get first letter of surname if existing */
function getSecondLetter(fullname) {
  let nameArray = fullname.split(' ');
  if (nameArray.length > 1) {
    return nameArray[1].charAt(0).toUpperCase();
  } else {
    return '';
  }
}

/** start rendering of contact list */
function includeListHTML() {
  const container = document.getElementById('contact-list');
  container.innerHTML = '';
  for (let i in firstNameLetters) {
    renderListLetter(container, i);
    for (let j in allUsersAlpha) {
      let firstL = allUsersAlpha[j].name.charAt(0).toUpperCase();
      let secondL = getSecondLetter(allUsersAlpha[j].name);
      if (firstL == firstNameLetters[i]) {
        renderListItem(j, firstL, secondL, container);
      }
    }
  }
}

/** render big letter of contact list */
function renderListLetter(container, i) {
  container.innerHTML += /*html*/ `<div class="contact-list-capital-container">
            <div class="contacts-list-capital text-21-400-black">${firstNameLetters[i]}</div>
            <div class="horizantal-line"></div>
          </div>`;
}

/** render user in contact list */
function renderListItem(j, firstL, secondL, container) {
  container.innerHTML += /*html*/ `<div class="contacts-list-item" onclick="openContact(this.id)" id="${allUsersAlpha[j].id}">
            <div style="background-color: ${allUsersAlpha[j].ringColor}" class="letter-ring-small">${firstL}${secondL}</div>
            <div class="contacts-item-container">
              <div class="contacts-item-name">${allUsersAlpha[j].name}</div>
              <div class="contacts-item-email">${allUsersAlpha[j].email}</div>
            </div>
          </div>`;
}

/** get random ring color of initials */
function setRingColorList() {
  for (const user of allUsersAlpha) {
    user.ringColor = getRandomColor();
  }
}

/** open or close add/edit contact container */
function toggleEditContainer() {
  document.getElementById('contacts-add-edit-container').classList.toggle('show-contacts-add-edit-container');
  document.getElementById('new-contact-name').value = '';
  document.getElementById('new-contact-email').value = '';
  document.getElementById('new-contact-phone').value = '';
  unsetRequiredText();
  renderAddBoxHTML();
}

/** check if it is an contact edit or a new contact */
function saveNewOrEdit() {
  let name = document.getElementById('new-contact-name').value;
  let email = document.getElementById('new-contact-email').value;
  let phone = document.getElementById('new-contact-phone').value;
  if (document.getElementById('edit-or-add-button').innerHTML === 'Save edit') {
    editContact(name, email, phone);
  } else if (document.getElementById('edit-or-add-button').innerHTML === 'Create contact') {
    addNewContact(name, email, phone);
  }
}

async function editContact(name, email, phone) {
  console.log(name, email, phone);
  if (newContactFormValidation(name, email, phone)) {
    console.log('Start save edit contact')
    let element = allUsers.findIndex(x => x.id === currentEditID);
    let elementAlpha = allUsersAlpha.findIndex(x => x.id === currentEditID);
    allUsers[element].name = name;
    allUsers[element].email = email;
    allUsers[element].phone = phone;
    allUsersAlpha[elementAlpha].name = name;
    allUsersAlpha[elementAlpha].email = email;
    allUsersAlpha[elementAlpha].phone = phone;
    await backend.setItem('allUsers', JSON.stringify(allUsers));
    setNameListAlpha();
    // setRingColorList();
    toggleEditContainer();
    renderContactList();
    openContact(currentEditID);
  }
}


/** validate input and create a new contact */
async function addNewContact(name, email, phone) {
  userId = allUsers.length
  if (newContactFormValidation(name, email, phone)) {
    const newContact = {
      name: name,
      email: email,
      password: "join",
      id: userId,
      phone: phone
    };
    allUsers.push(newContact);
    allUsersAlpha.push(newContact);
    // await backend.setItem('allUsers', JSON.stringify(allUsers));
    setNameListAlpha();
    setRingColorList();
    toggleEditContainer();
    renderContactList();
    showContactCreatedMessage();

  };
}

/** set form validation parameter*/
function newContactFormValidation(name, email, phone) {
  let vName = false;
  let vMail = false;
  let vPhone = false;
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  unsetRequiredText();
  if (checkAllInput(vName, vMail, vPhone, validRegex, name, email, phone)) {
    return true;
  }
}

/** check validation of name, email and phone */
function checkAllInput(vName, vMail, vPhone, validRegex, name, email, phone) {
  if (name.trim().length > 2) {
    vName = true;
  } else {
    document.getElementById('required-1').classList.add('required-animation');
  }
  if (email.trim().length > 7 && email.match(validRegex)) {
    vMail = true;
  } else {
    document.getElementById('required-2').classList.add('required-animation');
  }
  if (phone.trim().length > 5) {
    vPhone = true;
  } else {
    document.getElementById('required-3').classList.add('required-animation');
  }
  if (vName && vMail && vPhone) {
    console.log('validation all true');
    fullValidation = true;
    return true;
  }
}

/** unset error-text on new contact form */
function unsetRequiredText() {
  document.getElementById('required-1').classList.remove('required-animation');
  document.getElementById('required-2').classList.remove('required-animation');
  document.getElementById('required-3').classList.remove('required-animation');
}

/** edit a contact from list */
function openEditContainer(index) {
  currentEditID = index;
  let element = allUsersAlpha.findIndex(x => x.id === index);
  element = allUsersAlpha[element];
  toggleEditContainer();
  document.getElementById('new-contact-name').value = element.name;
  document.getElementById('new-contact-email').value = element.email;
  if (document.getElementById('new-contact-phone').value = element.phone == undefined) {
    document.getElementById('new-contact-phone').value = '';
  } else { document.getElementById('new-contact-phone').value = element.phone; }
  renderEditBoxHTML(element);
}

/** render edit box HTML */
function renderEditBoxHTML(element) {
  document.getElementById('edit-or-add-button').innerHTML = 'Save edit'
  document.getElementById('contacts-edit-headline').innerHTML = 'Edit contact'
  document.getElementById('contacts-edit-subheadline').innerHTML = '';
  document.getElementById('contacts-edit-right-avatar').innerHTML = getInitials(element.name);
  document.getElementById('contacts-edit-right-avatar').style.background = element.ringColor;
}

/** render add box html */
function renderAddBoxHTML() {
  document.getElementById('edit-or-add-button').innerHTML = 'Create contact'
  document.getElementById('contacts-edit-headline').innerHTML = 'Add contact'
  document.getElementById('contacts-edit-subheadline').innerHTML = 'Tasks are better with a team!';
  document.getElementById('contacts-edit-right-avatar').innerHTML = '<img src="./assets/img/contacts/avatar.png" alt="avatar img">';
  document.getElementById('contacts-edit-right-avatar').style.background = "var(--lightgrey)";
}

/** show contact created massage */
function showContactCreatedMessage() {
  document.getElementById('contact-created-message').classList.add('show-contact-created-message')
  setTimeout(() => {
    document.getElementById('contact-created-message').classList.remove('show-contact-created-message')
  }, 3000);
}




