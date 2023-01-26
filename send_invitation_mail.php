<?php

########### CONFIG ###############

$recipient = $_POST['invite-mail'];
// $time = time();
$redirect = 'add_task.html';

########### CONFIG END ###########



########### Intruction ###########   
#
#   This script has been created to send an email to the $recipient
#   (User-Mail-Adress on page: Add Task)
#   
##################################


switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");
        header('Content-Type: text/html; charset=UTF-8');
        $subject = "Task Invitation From Join";
        $headers = "From:  joinpasssword@web.de";
        $message = "Hallo, du wurdest von einem JOIN User eingeladen, gemeinsam eine Aufgabe zu lösen. Hier kannst du ein Konto eröffnen: https://gruppe-376.developerakademie.net/Join/index.html";

        mail($recipient, $subject, $message, $headers);
        header("Location: " . $redirect); 

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}

