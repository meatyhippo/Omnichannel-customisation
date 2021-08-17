<?php

include "../classes/header.php";

$C = new CLIColors();
echo $C->getColoredString('[START] Deleting Reviews.', 'blue')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');
//$API['reviewIds']        = Helper::getCLIAnswer('Which reviews do you want to delete? (comma separated ids without spaces 123,123,123,etc');
$API['reviewIds']        = $argv[1];

$ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

$ReviewIds = explode(',', $API['reviewIds']);

$ReviewCount = count($ReviewIds);

echo $C->getColoredString('[INFO] processing '.$ReviewCount.' reviews')."\n";

$RequestCounter = 1;

foreach($ReviewIds AS $rKey => $rValue){

    $RequestCounter = Helper::checkAPISleep($RequestCounter);

    try{

        $ApiC->reviews->delete($rValue);

        echo $C->getColoredString($ReviewCount.'. [Success] Review: '.$rValue.' deleted. ('.$RequestCounter.') requests', 'green')."\n";

    }catch(Exception $e){
        echo $C->getColoredString($ReviewCount.'. [ERROR] API Error: '.$e->getMessage().' ('.$RequestCounter.') requests', 'red')."\n";
    }

    $RequestCounter++;
    $ReviewCount--;
}

echo $C->getColoredString('[END] Deleting Reviews.', 'blue')."\n";
