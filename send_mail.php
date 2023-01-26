<?php

########### CONFIG ###############

$recipient = $_POST['email'];
$time = time();
$redirect = 'success_fmp.html';

########### CONFIG END ###########



########### Intruction ###########   
#
#   This script has been created to send an email to the $recipient
#   (User-Mail-Adress on page: forgot my password)
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

        $subject = "Contact From Join";
        $headers = "From:  joinpasssword@web.de";
        $message = "Hallo, hier kannst du dein Passwort resetten: https://gruppe-376.developerakademie.net/Join/reset.html?email=$recipient&timestamp=$time";

        mail($recipient, $subject, $message, $headers);
        header("Location: " . $redirect); 

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
