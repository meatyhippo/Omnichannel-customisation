<?php
error_reporting(0);
define(MYSQL_VISIBLE, false);

// include "../../shared/modelmysql.class.php";
// include "../../shared/helper.class.php";
// include "../../shared/clicolors.class.php";
// include "../../shared/webshopappclient.php";

include "../classes/header.php";

$apiURL = "https://api.statuspage.io/v1/pages/vlmmyqh2vn20/incidents.json";

$apiKey = Helper::getCLIAnswer('What is the API Key');

$ch = curl_init();

// set url
curl_setopt($ch, CURLOPT_URL, 'https://api.statuspage.io/v1/pages/vlmmyqh2vn20/incidents.json?page%20=2&api_key=e3b86931-062d-45a0-a25b-6a4fcf38f3ee');

// set method
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');

// return the transfer as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// send the request and save response to $response
$response = curl_exec($ch);

// stop if fails
if (!$response) {
    die('Error: "' . curl_error($ch) . '" - Code: ' . curl_errno($ch));
}

echo 'HTTP Status Code: ' . curl_getinfo($ch, CURLINFO_HTTP_CODE) . PHP_EOL;

// close curl resource to free up system resources
curl_close($ch);


$Incidents = json_decode($response, true);

$IncidentCount = 0;

foreach ($Incidents AS $iKey => $iValue){

    $IncidentCount++;

        echo $IncidentCount.";".$Incidents[$iKey]['created_at'].";".$Incidents[$iKey]['name'].";".$Incidents[$iKey]['status'].";".$Incidents[$iKey]['resolved_at']."\n";
}