<?php

include "../classes/header.php";

$DiscountCount          = 0;
$ApiLimit               = 250;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Deleting Discount Codes.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL Discount Codes.', 'red')."\n";

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
        $DiscountCount++;
    }
}

echo $C->getColoredString('[INFO] Found '.$DiscountCount.' discount codes to be deleted', 'yellow')."\n";

//Setting Up the API Connection
try {

    $Api = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

    $handle = fopen($SourceFile, "rb");

    //Loop through CSV to grab the codes
    while(!feof($handle)){

        $line = fgets($handle);

        if(strlen(trim($line)) > 2){

            $columns = explode(',', trim($line));

            $DiscountParams['id'] = $columns[0];
            //$DiscountParams['discount'] = $columns[1];

            $Discounts = $DiscountParams;

            foreach ($Discounts as $key) {

                echo $C->getColoredString($DiscountCount .'. Deleting code '.$line);

                Helper::checkAPISleep($ApiRequestsCount);

                $Api->discounts->delete($key);
            }
                $ApiRequestsCount++;
                echo $C->getColoredString('[SUCCESS] id '. $key .' has been deleted', 'green')."\n";
                
                $DiscountCount--;
        }
    }
} catch (Exception $e){
    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
    echo $C->getColoredString('[END] Deleting Discounts.', 'blue')."\n";
