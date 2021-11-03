<?php

include "../classes/header.php";


$ProductCount          = 0;
$ApiLimit               = 600;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Deleting Product Images.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes product images.', 'red')."\n";

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
        $ProductCount++;
    }
}
echo $C->getColoredString('[INFO] Found '.$ProductCount.' product images to be deleted', 'yellow')."\n";

//Setting Up the API Connection
try {

    $Api = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

    $handle = fopen($SourceFile, "rb");

    //Loop through CSV to grab the codes
    while(!feof($handle)){

        $line = fgets($handle);

        if(strlen(trim($line)) > 2){

            $columns = explode(',', trim($line));

            $ProductParams['id'] = $columns[0];
            $Products = $ProductParams;

            foreach ($Products as $key) {

                echo $C->getColoredString($ProductCount .'. Deleting Product Image '.$line);
                Helper::checkAPISleep($ApiRequestsCount);
                $ProductImages = $Api->productsImages->get($key);
                $ApiRequestsCount++;

                if (count($ProductImages) > 0){

                    foreach ($ProductImages as $pKey => $pValue){
                        Helper::checkAPISleep($ApiRequestsCount);
                        $imageID = $ProductImages[$pKey]['id'];
                        $Api->productsImages->delete($key, $imageID);
                        $ApiRequestsCount++;

                        echo $C->getColoredString(".","green");
                    }
                }else{
                    echo $C->getColoredString("No images found","yellow");
                }
            }
                echo $C->getColoredString('[SUCCESS] id '. $key .' has been deleted', 'green')."\n";
                $ProductCount--;
        }
    }
} catch (Exception $e){
    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
    echo $C->getColoredString('[END] Deleting Product Images.', 'blue')."\n";