setURL('https://stefan-heinemann.developerakademie.net/smallest_backend_ever');

let ringColorsOfUser = [];
let currentElement;
let marker = 0;

/**
 * start loading spinner, load data for board site,
 * get user if logged
 */
async function initBoard() {
   toggleSpinner();
   await downloadFromServer();
   allTasks = JSON.parse(backend.getItem('allTasks')) || [];
   allUsers = JSON.parse(backend.getItem('allUsers')) || [];
   taskID = backend.getItem('taskID') || 0;
   await includeHTML();
   getLoggedUser();
   setRingColors();
   setNavActive('navBoard');
   setTimeout(timeout, 1000); // timeout for loading spinner
   spinnerOff();
}

/**
 * delay updateHTML, this is only for showing loading spinner
 */
function timeout() {
   updateHTML(allTasks);
}

/**
 * stop loading spinner
 */
function spinnerOff() {
   myVar = setTimeout(toggleSpinner, 1200);
}

/**
 * display none loading spinner
 */
function toggleSpinner() {
   document.getElementById('loader').classList.toggle('d-none');
}


/**
 * includeHTML of header and navbar 
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

let allTodos;
let allProgress;

/**
 * clear content, find actual status of single task, render content new
 * @param {*} kindOfTasks 
 */
async function updateHTML(kindOfTasks) {
   document.getElementById('todo').innerHTML = '';
   document.getElementById('progress').innerHTML = '';
   document.getElementById('await').innerHTML = '';
   document.getElementById('done').innerHTML = '';

   document.getElementById('todo').classList.remove('highlight-div');
   document.getElementById('progress').classList.remove('highlight-div');
   document.getElementById('await').classList.remove('highlight-div');
   document.getElementById('done').classList.remove('highlight-div');

   allTodos = kindOfTasks.filter(t => t['status'] == 'todo');
   allProgress = kindOfTasks.filter(t => t['status'] == 'progress');
   allAwait = kindOfTasks.filter(t => t['status'] == 'await');
   allDone = kindOfTasks.filter(t => t['status'] == 'done');

   renderTodos(allTodos);
   renderProgress(allProgress);
   renderAwait(allAwait);
   renderDone(allDone);

   renderPrio(kindOfTasks);
   renderSubtaskBoard(kindOfTasks);
   renderLetter(kindOfTasks);
}


/**
 * find teammembers of a task and there first name capitals,
 * find teammember color, render color rings with capitals or digit if more then 3 members
 */
function renderLetter(kindOfTasks) {
   for (i = 0; i < kindOfTasks.length; i++) {
      const element = kindOfTasks[i];
      let teamLength = element['assigned']['assigned'].length; //5
      let teamMember = [];   //Array of IDs of team members

      for (j = 0; j < teamLength; j++) {
         let memberID = element['assigned']['assigned'][j];
         teamMember.push(memberID);
      }

      kLenght = teamMember.length;
      if (kLenght > 3) { kLenght = 3 }
      for (k = 0; k < kLenght; k++) {

         let memberName = allUsers.find(el => el.id == teamMember[k]);
         memberName = memberName['name'];
         let capitals = getCapitals(memberName);

         document.getElementById(`team-circle-${k + 1}-${element['id']}`).innerHTML = capitals;
         document.getElementById(`team-circle-${k + 1}-${element['id']}`).classList.remove('d-none');
         let position = findIndexOf(memberName);
         userColor = ringColorsOfUser[position];
         document.getElementById(`team-circle-${k + 1}-${element['id']}`).style.backgroundColor = userColor;
      }

      if (teamMember.length > 3) {
         plusSign = teamMember.length - 2;
         plusSign = '+' + plusSign;
         document.getElementById(`team-circle-3-${element['id']}`).innerHTML = plusSign;
         document.getElementById(`team-circle-3-${element['id']}`).style.background = "#2A3647";
      }
   }
}

/**
 * find position of member in allUsers array
 * @param {*} memberName 
 * @returns 
 */
function findIndexOf(memberName) {
   for (var l = 0; l < allUsers.length; l++) {
      if (allUsers[l].name === memberName) {
         return l;
      }
   }
}

/**
 * split first capitals from rest of name
 * @param {*} memberName 
 * @returns 
 */
function getCapitals(memberName) {
   return memberName.split(' ').map(word => word[0]).join('');
}

/**
 * render subtasks if set 
 * @param {*} kindOfTasks 
 */
function renderSubtaskBoard(kindOfTasks) {
   for (i = 0; i < kindOfTasks.length; i++) {
      let subDone = 0;
      let progress = 5;
      const element = kindOfTasks[i]
      const length = element['subtasks']['subtasks'].length;

      for (j = 0; j < length; j++) {
         if (element['subtasks']['subtasks'][j]['subStatus'] === 'done') {
            subDone += 1;
         }
      }

      if (length > 0) {
         document.getElementById(`subtask-${element['id']}`).classList.remove('d-none');
         document.getElementById(`doneCounter-${element['id']}`).innerHTML = `${subDone}/${length} Done`;
      }

      if (subDone > 0) {
         progress = subDone * 100 / length;
         document.getElementById(`progressbar-blue-${element['id']}`).setAttribute('style', `width:${progress}%`);
      }
   }
}

/**
 * render all tasks with status "todo"
 * @param {*} allTodos 
 */
function renderTodos(allTodos) {
   for (i = 0; i < allTodos.length; i++) {
      const element = allTodos[i];
      document.getElementById('todo').innerHTML += generateCardHTML(element);
   }
}

/**
 * render alls tasks with status "in progress"
 * @param {*} allProgress 
 */
function renderProgress(allProgress) {
   for (i = 0; i < allProgress.length; i++) {
      const element = allProgress[i];
      document.getElementById('progress').innerHTML += generateCardHTML(element);
   }
}

/**
 * render all tasks with status "awaiting feedback"
 * @param {*} allAwait 
 */
function renderAwait(allAwait) {
   for (i = 0; i < allAwait.length; i++) {
      const element = allAwait[i];
      document.getElementById('await').innerHTML += generateCardHTML(element);
   }
}

/**
 * render all tasks with status "done"
 * @param {*} allDone
 */
function renderDone(allDone) {
   for (i = 0; i < allDone.length; i++) {
      const element = allDone[i];
      document.getElementById('done').innerHTML += generateCardHTML(element);
   }
}

/**
 * set ring color of user by random
 */
function setRingColors() {
   for (i = 0; i < allUsers.length; i++) {
      var color = getRandomColor();
      ringColorsOfUser.push(color);
   }
}

/**
 * get a random color in hex code
 * @returns color 
 */
function getRandomColor() {
   var letters = '0123456789ABCDEF';
   var color = '#';
   for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
   }
   return color;
}

/**
 * render prio sign
 * @param {*} kindOfTasks 
 */
function renderPrio(kindOfTasks) {
   for (i = 0; i < kindOfTasks.length; i++) {
      const element = kindOfTasks[i];

      if (element['priority'] == 1) {
         document.getElementById(`card-prio-${element['id']}`).src = "./assets/img/add_task/low-arrow.svg";
      }

      if (element['priority'] == 2) {
         document.getElementById(`card-prio-${element['id']}`).src = "./assets/img/add_task/medium_equal.svg";
      }

      if (element['priority'] == 3) {
         document.getElementById(`card-prio-${element['id']}`).src = "./assets/img/add_task/urgent-arrow.svg";
      }
      if (element['status'] === 'done') {
         document.getElementById(`card-prio-${element['id']}`).src = "./assets/img/add_task/check-black.png";
      }
   }
}

/**
 * generate card content
 * @param {*} element 
 * @returns 
 */
function generateCardHTML(element) {
   let elementTitle = element['title'];
   let elementTitleLower = elementTitle.toLowerCase();
   let elementDescription = element['description'];
   let elementDescriptionLower = elementDescription.toLowerCase();
   let searchPositionTitle = elementTitleLower.search(searchInput);
   let searchPositionDescription = elementDescriptionLower.search(searchInput);
   let length = searchInput.length;


   if (searchPositionTitle >= 0 && marker == 1) {
      let markerTextTitle = elementTitle.substr(searchPositionTitle, length);
      let behindTextTitle = elementTitle.substr(searchPositionTitle + length,);
      let beforeTextTitle = '';
      if (searchPositionTitle > 0) {
         beforeTextTitle = elementTitle.slice(0, searchPositionTitle);
      }
      elementTitle = beforeTextTitle + '<mark>' + markerTextTitle + '</mark>' + behindTextTitle;
   }

   if (searchPositionDescription >= 0 && marker == 1) {
      let markerTextDescription = elementDescription.substr(searchPositionDescription, length);
      let behindTextDescription = elementDescription.substr(searchPositionDescription + length,);
      let beforeTextDescription = '';
      if (searchPositionDescription > 0) {
      }
      elementDescription = beforeTextDescription + '<mark>' + markerTextDescription + '</mark>' + behindTextDescription;
   }

   return renderCardHTML(element, elementTitle, elementDescription);
}

/**
 * render CardHTML
 * @param {*} element 
 * @param {*} elementTitle 
 * @param {*} elementDescription 
 * @returns 
 */
function renderCardHTML(element, elementTitle, elementDescription) {
   return /*html*/ `
      <div class="card" draggable="true" id="${element['id']}" ondragstart="startDragging(${element['id']})" onclick="showTaskBig(this.id)">

          <div class="category" style="background-color:${element['categoryColor']};">${element['category']}</div>
          <div class="card-title text-16-700-black">${elementTitle}</div>
          <div class="card-description">${elementDescription}</div>

        <div class="subtasks-board d-none" id="subtask-${element['id']}">
            <div class="progressbar-gray">
               <div class="progressbar-blue" id="progressbar-blue-${element['id']}"></div>
            </div>
            <div id="doneCounter-${element['id']}">#/# Done</div>
         </div>

         <div class="card-footer">
            <div class="team-member">
               <div class="team-circle d-none" id="team-circle-1-${element['id']}">#</div>
               <div class="team-circle d-none" id="team-circle-2-${element['id']}">#</div>
               <div class="team-circle d-none" id="team-circle-3-${element['id']}">#</div>
            </div>
            <div >
               <img id="card-prio-${element['id']}" src="" alt="">
            </div>
      </div>
         `;
}

/**
 * open big task card and if set => check/uncheck  subtask
 * @param {*} showTaskID 
 */
function showTaskBig(showTaskID) {
   currentElement = showTaskID;
   document.getElementById('show-task').classList.remove('d-none');
   const element = allTasks.find(el => el.id == showTaskID);
   document.getElementById('show-category').innerHTML = element['category'];
   document.getElementById('show-category').style.backgroundColor = element['categoryColor'];
   document.getElementById('show-title').innerHTML = element['title'];
   document.getElementById('show-description').innerHTML = element['description'];
   document.getElementById('show-date').innerHTML = element['dueDate'];
   renderShowPriority(element);
   renderShowAssigned(element);
   renderShowSubtasks(element);
}

/**
 * render subtasks on big show card
 * @param {*} element 
 */
function renderShowSubtasks(element) {
   document.getElementById('show-subtask-list').innerHTML = '';
   let subtaskLength = element['subtasks']['subtasks'].length;

   if (subtaskLength > 0) {
      document.getElementById('show-subtask-container').classList.remove('d-none');

      for (i = 0; i < subtaskLength; i++) {
         let subtaskStatus = element['subtasks']['subtasks'][i]['subStatus'];
         let checkBox = "./assets/img/board/checkbox-unchecked.png";
         if (subtaskStatus == 'done') { checkBox = "./assets/img/board/checkbox-checked.png" }
         document.getElementById('show-subtask-list').innerHTML += /*html*/ `
          <div class="show-subtask" onclick="checkSubtask(${element['id']}, ${i})">
            <img src=${checkBox} alt="">
            <span id="show-subtask-${i}">${element['subtasks']['subtasks'][i]['subTaskText']}</span>
         </div>
         `;
      }
   }
   else {
      document.getElementById('show-subtask-container').classList.add('d-none');
   }
}

/**
 * check if subtasks is open or done
 * @param {*} taskID 
 * @param {*} subtaskID 
 */
async function checkSubtask(taskID, subtaskID) {
   const element = allTasks.find(el => el.id == taskID);
   if (element['subtasks']['subtasks'][subtaskID]['subStatus'] == 'open') {
      element['subtasks']['subtasks'][subtaskID]['subStatus'] = 'done';
   } else {
      element['subtasks']['subtasks'][subtaskID]['subStatus'] = 'open';
   }
   renderShowSubtasks(element);
   await backend.setItem('allTasks', JSON.stringify(allTasks));
}

/**
 * render priority on big show card 
 * @param {*} element 
 */
function renderShowPriority(element) {
   let backgroundColr;
   let text;
   let sign;

   if (element['priority'] == 1) {
      backgroundColr = "#7AE229"
      sign = './assets/img/board/arrows-down-white.png';
      text = 'Low';
   }

   if (element['priority'] == 2) {
      backgroundColr = "#FFA800";
      sign = './assets/img/board/equal-sign-white.png';
      text = 'Medium';
   }

   if (element['priority'] == 3) {
      backgroundColr = "#FF3D00";
      sign = './assets/img/board/arrows-up-white.png';
      text = 'Urgent';
   }
   document.getElementById('show-priority').style.backgroundColor = backgroundColr;
   document.getElementById('show-priority').innerHTML = text + `<img src="${sign}" alt="">`;
}


/**
 * render assigned on big show card 
 * @param {*} element
 */
function renderShowAssigned(element) {
   document.getElementById('show-assigned').innerHTML = '';

   for (i = 0; i < element['assigned']['assigned'].length; i++) {
      let memberID = element['assigned']['assigned'][i];
      teamMember = allUsers.find(el => el.id == memberID).name;
      let memberCapitals = getCapitals(teamMember)
      let position = findIndexOf(teamMember);
      let userColor = ringColorsOfUser[position];

      document.getElementById('show-assigned').innerHTML += /*html*/ `<div class="show-member">
                        <div id="show-member-ring" class="show-task-team-circle" style="background-color:${userColor}">${memberCapitals}</div>
                        <div id="show-member-name">${teamMember}</div>
                     </div>`;
   }
}

/**
 * close show or edit card 
 * @param {*} cardName 
 */
function closeCard(cardName) {
   document.getElementById(cardName).classList.add('d-none');
   document.getElementById('edit-assigned-container').classList.remove('pullDown');
   document.getElementById('search-input').value = '';
   marker = 0;
   updateHTML(allTasks);
}

/**
 * open big edit card for task
 */
function openEditCard() {
   document.getElementById('edit-card').classList.remove('d-none');
   closeCard('show-task');
   renderEditCard();
}

/**
 * renderEditCard
 */
function renderEditCard() {
   let element = allTasks.find(task => task.id == currentElement);
   document.getElementById('edit-title').value = element['title'];
   document.getElementById('edit-description').value = element['description'];
   document.getElementById('edit-date').value = element['dueDate'];
   renderEditPrio(element);
   renderEditAssigned(element);
   renderEditRings(element);
}

/**
 * renderEditRings
 * @param {*} element 
 */
function renderEditRings(element) {
   document.getElementById('edit-ring-container').innerHTML = '';
   for (i = 0; i < element['assigned']['assigned'].length; i++) {
      let memberID = element['assigned']['assigned'][i];
      teamMember = allUsers.find(el => el.id == memberID).name;
      let memberCapitals = getCapitals(teamMember)
      let position = findIndexOf(teamMember);
      let userColor = ringColorsOfUser[position];
      document.getElementById('edit-ring-container').innerHTML += /*html*/ `
      <div class="edit-ring" style="background-color:${userColor}">${memberCapitals}</div>
      `;
   }
}


/**
 * renderEditAssigned
 * @param {*} element 
 */
function renderEditAssigned(element) {
   let length = allUsers.length;
   document.getElementById('edit-allUsers').innerHTML = '';
   for (i = 0; i < length; i++) {
      let userName = allUsers[i]['name'];
      let userID = allUsers[i]['id'];
      let checkedStatus = 'unchecked';
      let assignedLength = element['assigned']['assigned'].length;
      for (j = 0; j < assignedLength; j++) {
         if (element['assigned']['assigned'][j] == userID) {
            checkedStatus = 'checked';
            break;
         }
      }
      document.getElementById('edit-allUsers').innerHTML += /*html*/ `
      <div class="edit-assigned-user-line">
         <div>${userName}</div>
         <input type="checkbox" id="edit-assigned-userID-${userID}" ${checkedStatus}>
      </div>
      `;
   }
}

/**
 * open drop down menu
 */
function pullDown() {
   document.getElementById('edit-assigned-container').classList.toggle('pullDown');
   document.getElementById('pullDownArrow').classList.toggle('rotateZ');
}

/**
 * render edit priority
 * @param {*} element 
 */
function renderEditPrio(element) {
   let prio = element['priority'];
   setPrioColor(prio);
}

/**
 * set prio color
 * @param {*} prio 
 */
function setPrioColor(prio) {
   document.getElementById('edit-prio-1').style = "background-color:#fff; color:black";
   document.getElementById('edit-prio-1-img').src = "./assets/img/board/arrows-down-green.png";
   document.getElementById('edit-prio-2').style = "background-color:#fff; color:black";
   document.getElementById('edit-prio-2-img').src = "./assets/img/board/equal-sign-orange.png";
   document.getElementById('edit-prio-3').style = "background-color:#fff; color:black";
   document.getElementById('edit-prio-3-img').src = "./assets/img/board/arrows-up-red.png";

   if (prio == 1) {
      document.getElementById('edit-prio-1').style = "background-color:#7AE229; color:white";
      document.getElementById('edit-prio-1-img').src = "./assets/img/board/arrows-down-white.png";
   }
   if (prio == 2) {
      document.getElementById('edit-prio-2').style = "background-color:#FFA800; color:white";
      document.getElementById('edit-prio-2-img').src = "./assets/img/board/equal-sign-white.png";
   }
   if (prio == 3) {
      document.getElementById('edit-prio-3').style = "background-color:#FF3D00; color:white";
      document.getElementById('edit-prio-3-img').src = "./assets/img/board/arrows-up-white.png";
   }
}

let editPrio;
/**
 * set new priority
 * @param {*} prio 
 */
function editSetNewPrio(prio) {
   editPrio = prio;
   setPrioColor(prio);
}

/**
 * save edited task and close edit container 
 */
async function saveEditTask() {
   let validationStatus = 0;
   const element = allTasks.find(el => el.id == currentElement);
   let editTitle = document.getElementById('edit-title').value;
   let editDescription = document.getElementById('edit-description').value;
   dueDate = document.getElementById('edit-date').value;
   let editDueStatus = checkDate();
   let editAssigned = checkEditAssigned();
   validationStatus = formValidationOfEditTask(editTitle, editDescription, editDueStatus, editAssigned);
   if (validationStatus == 1) {
      element['title'] = editTitle;
      element['description'] = editDescription;
      element['dueDate'] = dueDate;
      element['priority'] = editPrio;
      element['assigned']['assigned'] = editAssigned;
      await backend.setItem('allTasks', JSON.stringify(allTasks));
      closeCard('edit-card');
   }
}

/**
 *  validate edited task
 * @param {*} editTitle 
 * @param {*} editDescription 
 * @param {*} editDueStatus 
 * @param {*} editAssigned 
 * @returns 
 */
function formValidationOfEditTask(editTitle, editDescription, editDueStatus, editAssigned) {
   if (editTitle == "") {
      requiredText('8');
      return 0;

   } else if (editDescription == "") {
      requiredText('9');
      return 0;
   } else if (editAssigned.length <= 0) {
      requiredText('11');
      return 0;
   } else if (editDueStatus == false) {
      requiredText('10');
      return 0;
   }
   else {
      return 1
   }
}


/**
 * check who is noe member of task team 
 * @returns new team
 */
function checkEditAssigned() {
   let team = [];
   for (i = 0; i < allUsers.length; i++) {
      let status = document.getElementById(`edit-assigned-userID-${i}`).checked;
      if (status) {
         team.push(i);
      }
   }
   return team
}

let searchTitle;
let searchDescription;
let searchInput = '';
/**
 * filter all matching tasks by title or description unless it is written with lower or upper cases
 */
function filterTasks() {
   marker = 0;
   let filteredTasks = [];
   searchInput = document.getElementById('search-input').value.toLowerCase();
   let length = allTasks.length;

   for (i = 0; i < length; i++) {
      searchTitle = allTasks[i]['title'].toLowerCase();
      searchDescription = allTasks[i]['description'].toLowerCase();
      if (searchTitle.match(searchInput) == searchInput || searchDescription.match(searchInput) == searchInput) {
         filteredTasks.push(allTasks[i]);
         marker = 1;
      }
   }
   updateHTML(filteredTasks);
}

/**
 * open the add task container 
 */
function toggleAddContainer() {
   document.getElementById('add-task-container').classList.toggle('hide-task-container');
   renderContacts();
}



/*******************************************
 ****************** darg and drop functions
 ******************************************/
let currentDraggedElement;

/**
 * starts draaging and rotate the dragged card 
 * @param {*} id 
 */
function startDragging(id) {
   currentDraggedElement = id;
   document.getElementById(id).classList.add('aslant');
}

/**
 * allow container to drop
 * @param {*} ev 
 */
function allowDrop(ev) {
   ev.preventDefault();
}

/**
 * change status of dropped task and update content,
 * save new status on server
 * @param {*} status 
 */
async function moveTo(status) {
   var indexOfTasksToChange = allTasks.findIndex(function (item, i) {
      return item.id == currentDraggedElement;
   })

   allTasks[indexOfTasksToChange]['status'] = status;
   updateHTML(allTasks);
   await backend.setItem('allTasks', JSON.stringify(allTasks));
}

/**
 * highlight the actual drop container 
 * @param {*} index 
 */
function highlight(index) {
   document.getElementById(index).classList.add('highlight-div');
}

/**
 * remove last highlight
 * @param {*} index 
 */
function removeHighlight(index) {
   document.getElementById(index).classList.remove('highlight-div');
}


/**
 * starts when clicked on + on "board"-page (mobile version)
 * directs to addTask
 */
function directToAddTask() {
   window.location.href = 'add_task_board.html';
}
