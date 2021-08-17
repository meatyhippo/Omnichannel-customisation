<?php

include "../classes/header.php";


$ProductCount          = 0;
$ApiLimit               = 250;
$ApiRequestsCount       = 1;


$C = new CLIColors();
echo $C->getColoredString('[START] Deleting products.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL products in the file.', 'red')."\n";

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

echo $C->getColoredString('[INFO] Found '.$ProductCount.' products to be deleted', 'yellow')."\n";

//Setting Up the API Connection
try {

    $Api = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

    $shopInfo = $Api->shopCompany->get();
    $shopName = $shopInfo['name'];
    $correctShop = Helper::getCLIAnswer("[SHOP NAME] $shopName ->> Is this the correct shop? (y/n)");

    if ($correctShop == 'y'){
        echo $C->getColoredString('[INFO] CORRECT SHOP --> CONTINUE SCRIPT', 'green')."\n";
        sleep(2);
        $handle = fopen($SourceFile, "rb");

    //Loop through CSV to grab the codes
    while(!feof($handle)){

        $line = fgets($handle);

        if(strlen(trim($line)) > 2){

            $columns = explode(',', trim($line));

            $ProductParams['id'] = $columns[0];
            //$ProductParams['discount'] = $columns[1];

            $Products = $ProductParams;

            foreach ($Products as $key) {

                echo $C->getColoredString($ProductCount .'. Deleting product '.$line);

                try {
                    Helper::checkAPISleep($ApiRequestsCount);
                    $Api->products->delete($key);
                }catch (Exception $e){
                    echo $e->getMessage();
                    continue;
                }


            }
                $ApiRequestsCount++;
                echo $C->getColoredString('[SUCCESS] id '. $key .' has been deleted', 'green')."\n";

                $ProductCount--;
        }
    }
    }else{
        echo $C->getColoredString('[ERROR] INCORRECT SHOP --> SCRIPT STOPPED', 'red')."\n";
        die();
    }

} catch (Exception $e){
    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
    echo $C->getColoredString('[END] Deleting Products.', 'blue')."\n";
