<?php

include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;


$C = new CLIColors();
echo $C->getColoredString('[START] Deleting Sets.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL product sets.', 'red')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

//Setting Up the API Connection
try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $ProductsSetCount = $ApiC->sets->count();

    
    echo $C->getColoredString("[INFO] ".$ProductsSetCount." needs to be processed.","yellow")."\n";

    $ProductsSetCountPages = ceil($ProductsSetCount / $ApiLimit);


    for ($ProductsSetCountPage = 1; $ProductsSetCountPage <= $ProductsSetCountPages; $ProductsSetCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $ProductsSetCountPage;
        $Params['limit'] = $ApiLimit;

        $ProductsSet = $ApiC->sets->get(null, $Params);
        
        $ApiRequestsCount++;

        foreach ($ProductsSet AS $rKey => $rValue) {

            echo $C->getColoredString($ProductsSetCount.". Deleting product set ".$ProductsSet[$rKey]['id']." ", "green");
            Helper::checkAPISleep($ApiRequestsCount);
            $ApiC->sets->delete($ProductsSet[$rKey]['id']);
        
            $ApiRequestsCount++;
                    
            echo $C->getColoredString(" [DONE]","green")."\n";
            $ProductsSetCount--;
        }
        
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}

    echo $C->getColoredString('[END] Deleting Set.', 'blue')."\n";
