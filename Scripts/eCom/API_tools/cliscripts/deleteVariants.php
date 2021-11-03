<?php

include "../classes/header.php";

$ApiLimit               = 800;
$ApiRequestsCount       = 1;


$C = new CLIColors();
echo $C->getColoredString('[START] Deleting Products.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL products.', 'red')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

//Setting Up the API Connection
try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $ProductsCount = $ApiC->products->count();

    
    echo $C->getColoredString("[INFO] ".$ProductsCount." needs to be processed.","yellow")."\n";

    $ProductsCountPages = ceil($ProductsCount / $ApiLimit);


    for ($ProductsCountPage = 1; $ProductsCountPage <= $ProductsCountPages; $ProductsCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $ProductsCountPage;
        $Params['limit'] = $ApiLimit;

        $Products = $ApiC->products->get(null, $Params);
        
        $ApiRequestsCount++;

        foreach ($Products AS $rKey => $rValue) {

            echo $C->getColoredString($ProductsCount.". Deleting product ".$Products[$rKey]['id']." ", "green");
            Helper::checkAPISleep($ApiRequestsCount);
            $ApiC->products->delete($Products[$rKey]['id']);
        
            $ApiRequestsCount++;
                    
            echo $C->getColoredString(" [DONE]","green")."\n";
            $ProductsCount--;
        }
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
    echo $C->getColoredString('[END] Deleting products.', 'blue')."\n";
