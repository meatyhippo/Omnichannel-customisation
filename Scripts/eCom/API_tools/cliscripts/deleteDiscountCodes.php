<?php

include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Deleting DiscountCodes.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL DiscountCodes.', 'red')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

//Setting Up the API Connection
try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $DiscountCount = $ApiC->discounts->count();

    echo $C->getColoredString("[INFO] ".$DiscountCount." needs to be processed.","yellow")."\n";

    $DiscountCountPages = ceil($DiscountCount / $ApiLimit);

    for ($DiscountCountPage = 1; $DiscountCountPage <= $DiscountCountPages; $DiscountCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $DiscountCountPage;
        $Params['limit'] = $ApiLimit;

        $Discounts = $ApiC->discounts->get(null, $Params);
        
        $ApiRequestsCount++;

        foreach ($Discounts AS $rKey => $rValue) {

            Helper::checkAPISleep($ApiRequestsCount);
            echo $C->getColoredString($DiscountCount.". Deleting discount ".$Discounts[$rKey]['id']." ", "green");
            $ApiC->discounts->delete($Discounts[$rKey]['id']);
        
            $ApiRequestsCount++;
                    
            echo $C->getColoredString(" [DONE]","green")."\n";
            $DiscountCount--;
        }   
   }
} catch (Exception $e){
    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
echo $C->getColoredString('[END] Deleting DiscountCodes.', 'blue')."\n";