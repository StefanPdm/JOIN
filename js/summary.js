let allTasksAmount = 0;
let todo = 0;
var progress = 0;
let await = 0;
let done = 0;
let urgent = 0;
let deadlineDate = 0;
let welcomeTime = "Good Yesterday,";


setURL('https://stefan-heinemann.developerakademie.net/smallest_backend_ever');

/**
 * download data from server, set active menu button, get logged user 
 */
async function initSummary() {
   await downloadFromServer();
   allTasks = JSON.parse(backend.getItem('allTasks')) || [];
   await includeHTML();
   setNavActive('navSummary');
   renderSummary();
   getLoggedUser();

}

/**
 * render Summary, get day time
 */
function renderSummary() {
   allTasksAmount = allTasks.length;
   document.getElementById('taskAllAmount').innerHTML = allTasksAmount;
   findStatus();
   document.getElementById('taskTodo').innerHTML = todo;
   document.getElementById('taskProgress').innerHTML = progress;
   document.getElementById('taskAwaiting').innerHTML = await;
   document.getElementById('taskUrgent').innerHTML = urgent;
   document.getElementById('upcomingDeadline').innerHTML = deadlineDate;
   document.getElementById('taskDone').innerHTML = done;
   findDayTime();
   document.getElementById('welcomeTime').innerHTML = welcomeTime;
   document.getElementById('welcomeTime-responsiv').innerHTML = welcomeTime;
}

/**
 * find status of several tasks and next upcoming deadline
 */
function findStatus() {
   let allDueDates = [];
   for (i = 0; i < allTasks.length; i++) {
      if (allTasks[i]['status'] == 'todo') {
         todo += 1
      }
      if (allTasks[i]['status'] == 'progress') {
         progress += 1
      }
      if (allTasks[i]['status'] == 'await') {
         await += 1
      } if (allTasks[i]['status'] == 'done') {
         done += 1
      }
      if (allTasks[i]['priority'] == 3) {
         urgent += 1
      }

      due = new Date(allTasks[i]['dueDate']).getTime();
      allDueDates.push(due);
   }
   finddDeadlineDate(allDueDates);

}

/**
 * get day time for user welcome
 */
function findDayTime() {
   let date = new Date().getHours();
   if (date < 10) {
      welcomeTime = " Good Morning,"
   } else if (date <= 12) {
      welcomeTime = " Good Day,"
   } else if (date < 17) {
      welcomeTime = " Good Afternoon,"
   } else {
      welcomeTime = " Good Evening,"
   }
   date = undefined;
}

/**
 * find next deadline and convert month to word
 * @param {*} allDueDates 
 */
function finddDeadlineDate(allDueDates) {
   allDueDates.sort(function (a, b) {
      return a - b
   });
   let date = new Date(allDueDates[0]);
   let month = '';
   let day = date.getDate();
   let year = date.getFullYear();
   const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
   ];
   month = monthNames[date.getMonth()];
   deadlineDate = month + ' ' + day + ', ' + year;
}


/**
 * starts onload when "summary"-page is opened
 * fetches the currentUser from the local storage
 */
function getLoggedUser() {
   currentUser = JSON.parse(localStorage.getItem('logged User') || '9999');
   if (currentUser == '9999') {
      document.getElementById('welcomeName').innerHTML = 'Dear Guest';
      return
   } else {
      // document.getElementById('welcomeTime').innerHTML += ',';
      // document.getElementById('welcomeTime-responsiv').innerHTML += ',';
      document.getElementById('welcomeName').innerHTML = currentUser.name;
      document.getElementById('welcomeName-responsiv').innerHTML = currentUser.name;
      document.getElementById('headerUserImg').src = "./assets/img/header/christina.png";
   }
}