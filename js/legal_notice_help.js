async function initLegalHelp() {
    await includeHTML();
    getLoggedUser();
}


/**
 * starts when clicked on arrow on "legal-notice"- and "help"-page
 * redirects to "summary"-page
 */
function backToSummary() {
    window.location.href = 'summary.html';
}


function getLoggedUser() {
    currentUser = JSON.parse(localStorage.getItem('logged User') || '9999');
    if (currentUser == '9999') {
        return;
    } else {
        document.getElementById('headerUserImg').src = "./assets/img/header/christina.png";
    }
}