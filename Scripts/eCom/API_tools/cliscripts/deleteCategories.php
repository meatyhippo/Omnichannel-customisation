<?php
//Lucien
include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Deleting Categories.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL categories.', 'red')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = "c2c84edc447b9f8de832d2e85e39fb63";
$API['apiSecret']        = "3424910993903ab16c495aee40642e83";
$API['apiLanguage']      = "nl";

//Setting Up the API Connection
try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $CategoryCount = $ApiC->categories->count();

    echo $C->getColoredString("[INFO] ".$CategoryCount." needs to be processed.","yellow")."\n";

    $CategoryCountPages = ceil($CategoryCount / $ApiLimit);

    for ($CategoryCountPage = 1; $CategoryCountPage <= $CategoryCountPages; $CategoryCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $CategoryCountPage;
        $Params['limit'] = $ApiLimit;

        $Categories = $ApiC->categories->get(null, $Params);
        
        $ApiRequestsCount++;

        foreach ($Categories AS $rKey => $rValue) {

            echo $C->getColoredString($CategoryCount.". Deleting category ".$Categories[$rKey]['id']." ".$Categories[$rKey]['title'], "green");
            Helper::checkAPISleep($ApiRequestsCount);
            $ApiC->categories->delete($Categories[$rKey]['id']);
        
            $ApiRequestsCount++;
                    
            echo $C->getColoredString(" [DONE]","green")."\n";
            $CategoryCount--;
        }
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}

    echo $C->getColoredString('[END] Deleting category.', 'blue')."\n";
