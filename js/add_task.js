let allTasks = [];
let prio = 0;
let category = '';
let categoryColor = '';
let assigned = [];
let subtaskID = 2;
let dueDate;
let taskID;

setURL('https://stefan-heinemann.developerakademie.net/smallest_backend_ever');

/**
 * load data from Server,
 * set arrays, include Header and Navbar,
 * set active menu button,
 * render contact list
 */
async function initAddTask() {
   await downloadFromServer();
   allUsers = JSON.parse(backend.getItem('allUsers')) || [];
   allTasks = JSON.parse(backend.getItem('allTasks')) || [];
   taskID = backend.getItem('taskID') || 0;
   await includeHTML();
   getLoggedUser();
   setNavActive('navAddTask');
   renderContacts();
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
 * render registrated user in assign list
 */
function renderContacts() {
   for (i = 0; i < allUsers.length; i++) {
      let userID = allUsers[i]['id'];

      if (allUsers[i]['name'] === currentUser['name']) {
         document.getElementById('assigned-list').innerHTML += /*html*/ `
      <div class="assign-line">
         <div>You</div>
         <input type="checkbox" id="userID-${userID}">
      </div>
      `;
      }
      else {
         document.getElementById('assigned-list').innerHTML += /*html*/ `
      <div class="assign-line">
         <div>${allUsers[i]['name']}</div>
         <input type="checkbox" id="userID-${userID}">
      </div>
      `;
      }
   }
   document.getElementById('assigned-list').innerHTML += /*html*/ `
      <div class="category-line check inviteNew" onclick="toggleInviteContact()">
         <div> Invite new Contact</div>
         <div><img style="" src="./assets/img/add_task/invite-symbol.png" alt=""></div>
      </div>
   `;
}

/**
 * open / close invite contact container 
 */
function toggleInviteContact() {
   document.getElementById('assign').classList.toggle('d-none');
   document.getElementById('invite-contact').classList.toggle('d-none');
}

/**
 * discard invitation process
 */
function discardInvitation() {
   toggleInviteContact();
}

/** */
// function sendInvitation() {

//    toggleInviteContact();
//    clearForm();
//    document.getElementById('assign').classList.remove('open-category');

// }

/**
 * show required text for form validation
 */
function requiredText(index) {
   document.getElementById(`required-titel-${index}`).classList.remove('d-none');
}

/**
 * delete placeholder text in textarea
 */
function clearContent() {
   if (document.getElementById('add-description').value == 'Enter a Description') {
      document.getElementById('add-description').value = '';
   }
}

/**
 * validation of input for a new task,
 * if true increase validationIndex or call required text function
 */
function formValidation() {
   let validation = 0;
   let vtitle = document.getElementById('add-title').value;
   let vdescription = document.getElementById('add-description').value;
   let vdate = document.getElementById('add-date').value;
   assigned = checkAssigned();
   dueDate = document.getElementById('add-date').value;
   let d = checkDate();

   if (vtitle === '') {
      requiredText('1')
   } else {
      validation += 1;
      document.getElementById(`required-titel-1`).classList.add('d-none');
   }

   if (vdescription === '') {
      requiredText('2')
   } else {
      validation += 1;
      document.getElementById(`required-titel-2`).classList.add('d-none');
   }

   if (category == '') {
      requiredText('3')
   } else {
      validation += 1;
      document.getElementById(`required-titel-3`).classList.add('d-none');
   }

   if (assigned.length < 1) {
      requiredText('4')
   } else {
      validation += 1;
      document.getElementById(`required-titel-4`).classList.add('d-none');
   }

   if (vdate === '') {
      requiredText('5')

   } else {
      validation += 1;
      document.getElementById(`required-titel-5`).classList.add('d-none');
   }

   if (prio == 0) {
      requiredText('6')

   } else {
      validation += 1;
      document.getElementById(`required-titel-6`).classList.add('d-none');
   }

   if (d == false) {
      requiredText('7')
   } else {
      validation += 1;
      document.getElementById(`required-titel-7`).classList.add('d-none');
   }

   if (validation == 7) {
      document.getElementById('taskAddedMessage').classList.add('taskAddedMessageOut')
      addTask();
   }
}

/**
 * validate if dueDate is larger then today
 */
function checkDate() {
   var toDate = new Date();
   if (new Date(dueDate).getTime() <= toDate.getTime() || dueDate === '') {
      return false;
   }
   return true;
}

/**
 * add new task to allTasks array and save it on server,
 * increase TaskID and save it on server,
 * redirects to board html
 */
async function addTask() {
   let title = document.getElementById('add-title').value;
   let description = document.getElementById('add-description').value;
   let subtasks = checkSubtasks();
   taskID += 1;

   let task =
   {
      'id': taskID,
      'title': title,
      'description': description,
      'status': 'todo',
      'dueDate': dueDate,
      'priority': prio,
      'category': category,
      'categoryColor': categoryColor,
      'assigned': {
         assigned
      },
      'subtasks': {
         subtasks
      }
   };

   allTasks.push(task);
   await backend.setItem('allTasks', JSON.stringify(allTasks));
   await backend.setItem('taskID', taskID);
   setTimeout(() => { window.location.href = 'board.html' }, 2000);
}

/**
 * check which user is assigned to task
 */
function checkAssigned() {
   let team = [];
   for (i = 0; i < allUsers.length; i++) {
      let status = document.getElementById(`userID-${i}`).checked;
      if (status) {
         team.push(i);
      }
   }
   return team
}


/**
 * get what subtask is checked and when push it to actual subtask array
 */
function checkSubtasks() {
   let subs = [];
   for (i = 1; i < subtaskID + 1; i++) {
      checkedSub = document.getElementById(`subtask-${i}`).checked;
      subTaskText = document.getElementById(`subtask-${i}`).nextElementSibling.innerText;
      if (checkedSub) {
         let subPush = {
            'subID': i,
            'subTaskText': subTaskText,
            'subStatus': 'open'
         }
         subs.push(subPush)
      }
   }
   return subs;
}

/**
 * clear form, reset subtaskID
*/
function clearForm() {
   document.getElementById('add-title').value = '';
   document.getElementById('add-description').value = 'Enter a Description';
   dueDate = document.getElementById('add-date').value = '';
   for (i = 1; i < 4; i++) {
      document.getElementById(`prio-${i}`).style.background = "white";
      document.getElementById(`prio-${i}`).classList.remove('prio-active');
   }
   loadCategories('Select task Category', '#fff');
   document.getElementById('assign').classList.remove('open-category');
   subtaskID = 2;
   document.getElementById('subtask-container').innerHTML = '';
   document.getElementById('subtask-container').innerHTML = /*html*/ `<div><input type="checkbox" id="subtask-1"><span>Inform Customer Support</span></div>
   <div> <input type="checkbox" id="subtask-2"><span>Send marketing paper</span></div>`;
   renderSubtask();
}

/**
 * set prio index and draw the buttons in right color
 * @param {*} index 
 */
function setPrio(index) {
   prio = index;
   prioContainer = document.getElementById(`prio-${index}`);
   prioContainer.classList.add('prio-active');

   if (index == 1) {
      prioContainer.style.background = "var(--prio-low-green)";
      document.getElementById(`prio-2`).style.background = "white";
      document.getElementById(`prio-3`).style.background = "white";
      document.getElementById(`prio-2`).classList.remove('prio-active');
      document.getElementById(`prio-3`).classList.remove('prio-active');
   } if (index == 2) {
      prioContainer.style.background = "var(--prio-medium-orange)";
      document.getElementById(`prio-1`).style.background = "white";
      document.getElementById(`prio-3`).style.background = "white";
      document.getElementById(`prio-1`).classList.remove('prio-active');
      document.getElementById(`prio-3`).classList.remove('prio-active');

   } if (index == 3) {
      prioContainer.style.background = "var(--prio-urgent-red)";
      document.getElementById(`prio-1`).style.background = "white";
      document.getElementById(`prio-2`).style.background = "white";
      document.getElementById(`prio-1`).classList.remove('prio-active');
      document.getElementById(`prio-2`).classList.remove('prio-active');
   }
}


/**
 * open dropdown menu and close other when opened
 */
function pullDownMenu(index, closeDex) {
   document.getElementById(index).classList.toggle('open-category');
   document.getElementById(closeDex).classList.remove('open-category');

   document.getElementById('color-picker').classList.add('d-none');

}

/**
*select a standard category  
*/
function selectCategory(index) {
   let color = ``;
   category = index;
   if (index == 'Sales') {
      color = `<div class="ring purple"></div>`;
      categoryColor = '#da70d6';
   }
   if (index == 'Backoffice') {
      color = `<div class="ring green"></div>`
      categoryColor = '#20b2aa';
   }

   sel = index + color;
   document.getElementById('selected-category').innerHTML = sel;
   document.getElementById('categories').classList.remove('open-category');
}

/**
*open input field for new category and open colorpicker  
*/
function newCategory() {
   document.getElementById('categories').innerHTML = renderNewCategory();
   document.getElementById('color-picker').classList.remove('d-none');
   document.getElementById('categories').classList.remove('open-category');
}

/**
*rendering input field for a new category  
*/
function renderNewCategory() {
   categoryColor = '#add8e6';
   let render = /*html*/ `<div class="new-category">
      <input id="input-new-category" type="text" placeholder="New category name" >
      <button type="button" onclick="loadCategories('Select task Category','#fff')"><img src="./assets/img/add_task/x-img.png" alt=""></button>
      <div></div>
      <button type="button" onclick="setNewCategory()"><img src="./assets/img/add_task/check-black.png" alt=""></button>
   </div>`;
   return render;
}

/**
*set selected color of a new category
*/
function setNewCategoryColor(color, id) {
   categoryColor = color;
   let index = id.slice(-1);
   index = +index;
   for (i = 1; i < 7; i++) {
      if (i == index) {
         document.getElementById(`col-${i}`).classList.add('active-ring');
      } else {
         document.getElementById(`col-${i}`).classList.remove('active-ring');
      }
   }
}

/**
*creates a new category  
*/
function setNewCategory() {
   category = document.getElementById('input-new-category').value;
   document.getElementById('categories').innerHTML = renderCategories(category, categoryColor);
   document.getElementById('color-picker').classList.add('d-none');
}

/**
*render pulldown selection menu of category 
*/
function renderCategories(category, categoryColor) {
   let render = /*html*/ `
   <div onclick = "pullDownMenu('categories', 'assign')">
   <div class="category-line" id="selected-category">
      ${category}<div class="ring" style="background: ${categoryColor};"></div>
   </div>
   <img src="./assets/img/add_task/pull-down-arrow.png" alt=""></div><div class="category-line" onclick="newCategory()">New Category</div>
   <div class="category-line" onclick="selectCategory('Sales')"><div> Sales</div >
   <div class="ring purple">
   </div>
   </div >
   <div class="category-line" onclick="selectCategory('Backoffice')">
   <div>Backoffice</div>
   <div class="ring green"></div>
   </div>
   `;
   return render;
}

/**
*writing actual category inside input field 
*/
function loadCategories(category, categoryColor) {
   document.getElementById('categories').innerHTML = renderCategories(category, categoryColor);
   document.getElementById('color-picker').classList.add('d-none');
}

/**
*open input field for new subtask 
*/
function addNewSubtask() {
   document.getElementById('addNewSubtask').innerHTML = '';
   document.getElementById('addNewSubtask').innerHTML = renderAddSubtask();
}

/**
*render innerHTML for subtask input field 
*/
function renderAddSubtask() {
   let render = /*html*/ `
   <div class="newTask">
      <input id="input-new-subtask" type="text" placeholder="New subtask">
   
      <button type="button" onclick="renderSubtask()"><img src="./assets/img/add_task/x-img.png" alt=""></button>

      <div></div>

      <button type="button" onclick="renderAddedSubtask()"><img src="./assets/img/add_task/check-black.png" alt=""></button>
   </div>`;
   return render;
}

/**
*render innerHTML into subtasklist underneath input field
*/
function renderAddedSubtask() {
   let newTask = document.getElementById('input-new-subtask').value
   if (!newTask == '') {
      subtaskID += 1;
      document.getElementById('input-new-subtask').value = '';
      document.getElementById('subtask-container').innerHTML += /*html*/ `<div><input type="checkbox" id="subtask-${subtaskID}" checked><span>${newTask}</span></div>`;
   }
}


/**
*render clean innerHTML for new subtask field
*/
function renderSubtask() {
   document.getElementById('addNewSubtask').innerHTML = '';
   document.getElementById('addNewSubtask').innerHTML = `<div class="subButton">
                           <button type="button" onclick="addNewSubtask()">Add new subtask</button>
                        </div>`;
}

/**
 * starts onload when "summary"-page is opened
 * fetches the currentUser from the local storage
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
 * starts when clicked on x (AddTask mobile Version)
 * directs back to "board"-page
 */
function backToBoard() {
   window.location.href = 'board.html';
}