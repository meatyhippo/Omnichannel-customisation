<?php

include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;


$C = new CLIColors();
echo $C->getColoredString('[START] Deleting Subscribers.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL Subscribers.', 'red')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

//Setting Up the API Connection
try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $SubscribtionsCount = $ApiC->subscriptions->count();

    
    echo $C->getColoredString("[INFO] ".$SubscribtionsCount." needs to be processed.","yellow")."\n";

    $SubscribtionsCountPages = ceil($SubscribtionsCount / $ApiLimit);


    for ($SubscribtionsCountPage = 0; $SubscribtionsCountPage <= $SubscribtionsCountPages; $SubscribtionsCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $SubscribtionsCountPage;
        $Params['limit'] = $ApiLimit;

        $Subscribers = $ApiC->subscriptions->get(null, $Params);
        
        $ApiRequestsCount++;

        foreach ($Subscribers AS $rKey => $rValue) {

            echo $C->getColoredString($SubscribtionsCount.". Deleting subscription ".$Subscribers[$rKey]['id']." ", "green");
            Helper::checkAPISleep($ApiRequestsCount);
            $ApiC->subscriptions->delete($Subscribers[$rKey]['id']);
        
            $ApiRequestsCount++;
                    
            echo $C->getColoredString(" [DONE]","green")."\n";
            $SubscribtionsCount--;
            sleep(1);
        }
        
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}

    echo $C->getColoredString('[END] Deleting Subscribers.', 'blue')."\n";
