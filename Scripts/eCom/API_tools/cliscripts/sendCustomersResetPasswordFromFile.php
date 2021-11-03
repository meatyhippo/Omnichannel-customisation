<?php

include "../classes/header.php";

$CustomerCount           = 0;
$PageLimit               = 250;
$ApiRequestsCount        = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Getting Customers from file.', 'blue') . "\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

//Product Details
$CSVFilename             = Helper::getCLIAnswer('Provide the filename of csv:');

$SourceFile = '../inputs/'.$CSVFilename;

if(!file_exists($SourceFile)){
    echo $C->getColoredString('[FATAL ERROR] Source file doesn\'t exist' ,'red')."\n";
    exit;
}

$handle = fopen($SourceFile, "rb");

//Count the items to be processed
while(!feof($handle)){

    $line = fgets($handle);

    if(strlen(trim($line)) > 2){
        $CustomerCount++;
    }

}
echo $C->getColoredString('[INFO] Found '.$CustomerCount.' customers, were the email is being send to', 'yellow')."\n";

try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

    $handle = fopen($SourceFile, "rb");

    echo $C->getColoredString("[INFO] ".$CustomerCount." needs to be processed.","yellow")."\n";

    $CustomersCountPages = ceil($handle / $PageLimit);


    for ($CustomersCountPage = 1; $CustomersCountPage <= $CustomersCountPages; $CustomersCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $CustomersCountPage;
        $Params['limit'] = $PageLimit;

        $Customers = $ApiC->customers->get(null, $Params);

        $ApiRequestsCount++;

    
        foreach ($Customers as $rKey => $rValue) {

            echo $C->getColoredString($CustomersCount . ". Sending customers reset link " . $Customers[$rKey]['id'] . " ", "green");
            Helper::checkAPISleep($ApiRequestsCount);

            $ApiC->customers->update($handle, [
                'doNotifyPassword' => true
            ]);

            $ApiRequestsCount++;

            echo $C->getColoredString(" [DONE]", "green") . "\n";
            $CustomersCount--;
        }
    }
} catch (Exception $e) {

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red') . "\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red') . "\n";
}
echo $C->getColoredString('[END] Sending customers reset link.', 'blue') . "\n";