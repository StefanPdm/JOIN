"use strict";

setURL('https://stefan-heinemann.developerakademie.net/smallest_backend_ever');
let allUsers = [];

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

function getLoggedUser() {
  currentUser = JSON.parse(localStorage.getItem('logged User') || '9999');
  if (currentUser == '9999') {
    return;
  } else {
    document.getElementById('headerUserImg').src = "./assets/img/header/christina.png";
  }
}

function openContact() {
  {
    document.getElementById('user-1').classList.add('active-user')
  }
}