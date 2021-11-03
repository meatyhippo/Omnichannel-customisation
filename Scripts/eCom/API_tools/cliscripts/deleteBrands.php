<?php
//Lucien
include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Deleting Brands.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL brands.', 'red')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

//Setting Up the API Connection
try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $BrandCount = $ApiC->brands->count();

    echo $C->getColoredString("[INFO] ".$BrandCount." needs to be processed.","yellow")."\n";

    $BrandCountPages = ceil($BrandCount / $ApiLimit);


    for ($BrandCountPage = 1; $BrandCountPage <= $BrandCountPages; $BrandCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $BrandCountPage;
        $Params['limit'] = $ApiLimit;

        $Brands = $ApiC->brands->get(null, $Params);
        
        $ApiRequestsCount++;

        foreach ($Brands AS $rKey => $rValue) {

            echo $C->getColoredString($BrandCount.". Deleting category ".$Brands[$rKey]['id']." ".$Brands[$rKey]['title'], "green");
            Helper::checkAPISleep($ApiRequestsCount);
            $ApiC->brands->delete($Brands[$rKey]['id']);
        
            $ApiRequestsCount++;
                    
            echo $C->getColoredString(" [DONE]","green")."\n";
            $BrandCount--;
        }
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}

    echo $C->getColoredString('[END] Deleting category.', 'blue')."\n";
