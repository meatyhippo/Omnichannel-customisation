<?php

include "../classes/header.php";


$DiscountCount          = 0;
$ApiLimit               = 250;
$ApiRequestsCount       = 1;


$C = new CLIColors();
echo $C->getColoredString('[START] Updating discounts.', 'blue')."\n";

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

echo $C->getColoredString('[INFO] Found '.$DiscountCount.' discounts to be updated', 'yellow')."\n";

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

                echo $C->getColoredString($DiscountCount .'. updating discount '.$line);

                Helper::checkAPISleep($ApiRequestsCount);

                $res = $Api->discounts->update($key,[
                    'isActive'      => true,
                    'startDate'     => "2020-01-06",
                    'endDate'       => "2020-03-02",
                    'type'          => "price",
                    'discount'      => "1697.50",
                    'applyTo'       => "products",
                    'products'      => "104983506",
                    'shipment'      => "free",
                    'usageLimit'    => "1",
                    'minimum_after' => false, //false = voor korting, true = na korting
                    'minimumAmount' => "698"
                ]);
            }
                $ApiRequestsCount++;
                echo $C->getColoredString('[SUCCESS] id '. $key .' has been updated', 'green')."\n";
                
                $DiscountCount--;
        }
    }
} catch (Exception $e){
    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
    echo $C->getColoredString('[END] Updating Discounts.', 'blue')."\n";
