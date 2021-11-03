<?php

include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Deleting All Product Images.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL product Images.', 'red')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

    $ProductsCount = $ApiC->catalog->count();
    echo $C->getColoredString("[INFO] ".$ProductsCount." needs to be processed.","yellow")."\n";

    $ProductsCountPages = ceil($ProductsCount / $ApiLimit);

    for ($ProductsCountPage = 1; $ProductsCountPage <= $ProductsCountPages; $ProductsCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $ProductsCountPage;
        $Params['limit'] = $ApiLimit;

        $Products = $ApiC->catalog->get(null, $Params);
        $ApiRequestsCount++;

        foreach ($Products AS $rKey => $rValue) {

            echo $C->getColoredString($ProductsCount.". Starting product ".$Products[$rKey]['id']." ", "green");

            Helper::checkAPISleep($ApiRequestsCount);
            $ProductImages = $ApiC->productsImages->get($Products[$rKey]['id']);
            $ApiRequestsCount++;

            if(count($ProductImages) > 0){

                foreach($ProductImages AS $pKey => $pValue){

                    Helper::checkAPISleep($ApiRequestsCount);
                    $ApiC->productsImages->delete($Products[$rKey]['id'], $ProductImages[$pKey]['id']);
                    $ApiRequestsCount++;

                    echo $C->getColoredString(".","green");
                }

            } else{
                echo $C->getColoredString("No images found","yellow");
            }

            echo $C->getColoredString(" [DONE]","green")."\n";
            $ProductsCount--;
        }
    }
}catch (Exception $e){
    echo $C->getColoredString('[API ERROR] '. $e->getMessage(), 'red')."\n";
}