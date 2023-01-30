"use strict";

setURL('https://stefan-heinemann.developerakademie.net/smallest_backend_ever');
let allUsers = [];
let allUsersAlpha = [];
let firstNameLetters = [];
let ringColorList = [];

/**
 * load data from Server,
 * set arrays, include Header and Navbar,
 * set active menu button,
 * render contact list
 */
async function initContacts() {
  await downloadFromServer();
  allUsers = JSON.parse(backend.getItem('allUsers')) || [];
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
}

/**
 * show contact details
 */
function showContactDetails(id) {
  let element = document.getElementById('contacts-show-detail-container');
  id = id * 1;
  let userArrayIndex = allUsers.findIndex(x => x.id === id);
  let initials = getInitials(allUsers[userArrayIndex].name);
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
              <div class="detail-name">${allUsers[userArrayIndex].name}</div>
              <div class="add-task text-16-400-blue">+ Add Task</div>
            </div>
          </div>
          <!-- edit container -->
          <div class="contact-detail-edit-container" id="contact-detail-edit-container">
            <div class="contact-detail-title text-21-400-black">Contact Information</div>
            <div class="contact-edit-item-container">
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
              <div class="text-16-400-blue">${allUsers[userArrayIndex].email}</div>
            </div>
            <div class="contacts-detail-item">
              <div>Phone</div>
              <div class="text-16-400-black">${allUsers[userArrayIndex].phone}</div>
            </div>
          </div><!-- add button -->
          <div class="button text-21-700-black">
            <div>New contact</div>
            <div><img src="./assets/img/contacts/new-contact.png" alt=""></div>
          </div>
          `;
}

function renderContactList() {

  findFirstNameLetter();
  includeListHTML();
}

function setNameListAlpha() {
  allUsersAlpha = allUsers.sort((a, b) => a.name.localeCompare(b.name));
}

function findFirstNameLetter() {
  for (let i in allUsersAlpha) {
    const firstLetter = allUsersAlpha[i].name.charAt(0).toUpperCase();
    if (!firstNameLetters.includes(firstLetter)) {
      firstNameLetters.push(firstLetter);
    }
  }
}

function getInitials(fullname) {
  return (getFirstLetter(fullname) + getSecondLetter(fullname));
}

function getFirstLetter(fullname) {
  return fullname.charAt(0).toUpperCase();
}

function getSecondLetter(fullname) {
  let nameArray = fullname.split(' ');
  if (nameArray.length > 1) {
    return nameArray[1].charAt(0).toUpperCase();
  } else {
    return '';
  }
}

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

function renderListLetter(container, i) {
  container.innerHTML += /*html*/ `<div class="contact-list-capital-container">
            <div class="contacts-list-capital text-21-400-black">${firstNameLetters[i]}</div>
            <div class="horizantal-line"></div>
          </div>`;
}

function renderListItem(j, firstL, secondL, container) {
  container.innerHTML += /*html*/ `<div class="contacts-list-item" onclick="openContact(this.id)" id="${allUsersAlpha[j].id}">
            <div style="background-color: ${allUsersAlpha[j].ringColor}" class="letter-ring-small">${firstL}${secondL}</div>
            <div class="contacts-item-container">
              <div class="contacts-item-name">${allUsersAlpha[j].name}</div>
              <div class="contacts-item-email">${allUsersAlpha[j].email}</div>
            </div>
          </div>`;
}

function setRingColorList() {
  for (const user of allUsersAlpha) {
    user.ringColor = getRandomColor();
  }
}