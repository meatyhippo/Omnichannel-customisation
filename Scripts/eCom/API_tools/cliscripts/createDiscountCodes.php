<?php
//Lucien

include "../classes/header.php";

$DiscountCount = 0;
$RequestCount  = 1;
$CreatedDiscounts = array();

$C = new CLIColors();

echo $C->getColoredString('[START] Adding discount codes.', 'blue')."\n";

//Grabbing the API Details
$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

//Discount Details
$CSVFilename             = Helper::getCLIAnswer('Provide the filename of csv:');

$ResultsFile    = fopen("../inputs/discountResult.csv", "w");
$ReportDir = '../inputs/';

$SourceFile = $ReportDir.$CSVFilename;

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

echo $C->getColoredString('[INFO] Found '.$DiscountCount.' discount codes to be processed', 'yellow')."\n";

//Discount Specific Questions
$DiscountParams['isActive']         = (bool) Helper::getCLIAnswer('Do you want the Discount Codes to be directly active? (1 for yes, 0 for no)');
$DiscountParams['startDate']        = Helper::getCLIAnswer('What is the start date of the coupon code? (YYYY-MM-DD)');
$DiscountParams['endDate']          = Helper::getCLIAnswer('What is the end date of the coupon code? (YYYY-MM-DD)');
$DiscountParams['type']             = Helper::getCLIAnswer('What kind of discount do you wanna give? (price or percentage?)');
$DiscountParams['discount']         = (float) Helper::getCLIAnswer('How much discount do you wanna give?');
$DiscountParams['applyTo']          = Helper::getCLIAnswer('To which part of the catalog is the coupon code for? ( all | categories | products | productscategories)');
if ($DiscountParams['applyTo']      == 'categories') {
$DiscountParams['categories']       = Helper::getCLIAnswer('Which categories do you want for the coupon code? (category_id, separated by comma)');
}elseif($DiscountParams['applyTo'] == 'products'){
$DiscountParams['products']         = Helper::getCLIAnswer('Which products do you want for the coupon code?(product_id, separated by comma)');
}elseif($DiscountParams['applyTo'] == 'productscategories'){
$DiscountParams['products']         = Helper::getCLIAnswer('Which products do you want for the coupon code?(product_id, separated by comma)');
$DiscountParams['categories']       = Helper::getCLIAnswer('Which categories do you want for the coupon code? (category_id, separated by comma)');
}
$DiscountParams['shipment']         = Helper::getCLIAnswer('What kind of shipment do you want? ( default (vallen niet binnen de korting)| discount (vallen binnen de korting)| free)');
$DiscountParams['usageLimit']       = (integer)Helper::getCLIAnswer('What is the amount of times a coupon code can be used. (int, 1,5,10,50,100)');
$DiscountParams['minimumAmount']    = (float) Helper::getCLIAnswer('What is the minimum amount the customer should spend? (ex. 100.12 or 100) ');
$DiscountParams['minimum_after']    = (bool) Helper::getCLIAnswer('Should the minimum order value before or after discount. (0 for before, 1 for after)');

//Setting Up the API Connection
try {

    $Api = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

    $handle = fopen($SourceFile, "rb");

    //Loop through CSV to grab the codes
    while(!feof($handle)){

        $line = fgets($handle);

        if(strlen(trim($line)) > 2){

            $DiscountParams['code'] = trim($line);

            echo $C->getColoredString($DiscountCount .'. Creating code '.$line);

            try {

                $RequestCount++;

                Helper::checkAPISleep($RequestCount);

                $DiscountResult = $Api->discounts->create($DiscountParams);

                echo $C->getColoredString('[SUCCESS] id '.$DiscountResult['id'].' has been created', 'green')."\n";
    
                //update discount code //75090086
                $CreatedDiscounts[] = $DiscountResult['id'];

            } catch (Exception $e){
                echo $C->getColoredString('[ERROR] '.$e->getMessage(),'red')."\n";
            }
            $DiscountCount--;

        }
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
foreach ($CreatedDiscounts as $key) {
    $row = [
        $key
    ];
    fputcsv($ResultsFile,$row);
}

echo $C->getColoredString('[RESULTS] A list of created discount id\'s', 'cyan')."\n";

echo implode( ', ',$CreatedDiscounts)."\n";
echo $C->getColoredString('[INFO] Total discounts created. '. count($CreatedDiscounts). ' ', 'yellow')."\n"; ;

fclose($ResultsFile);
exec ("open ".$ReportDir);

echo $C->getColoredString('[END] Adding discount codes.', 'blue')."\n";
