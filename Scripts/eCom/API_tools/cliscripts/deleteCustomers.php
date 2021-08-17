<?php

include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;


$C = new CLIColors();
echo $C->getColoredString('[START] Deleting Customers.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL Customers.', 'red')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

//Setting Up the API Connection
try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $CustomersCount = $ApiC->customers->count();

    
    echo $C->getColoredString("[INFO] ".$CustomersCount." needs to be processed.","yellow")."\n";

    $CustomersCountPages = ceil($CustomersCount / $ApiLimit);


    for($CustomersCountPage = 1; $CustomersCountPage <= $CustomersCountPages; $CustomersCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $CustomersCountPage;
        $Params['limit'] = $ApiLimit;

        $Customers = $ApiC->customers->get(null, $Params);
        
        $ApiRequestsCount++;

        foreach ($Customers AS $rKey => $rValue) {

            echo $C->getColoredString($CustomersCount.". Deleting customer ".$Customers[$rKey]['id']." ", "green");
            Helper::checkAPISleep($ApiRequestsCount);
            $ApiC->customers->delete($Customers[$rKey]['id']);
        
            $ApiRequestsCount++;
                    
            echo $C->getColoredString(" [DONE]","green")."\n";
            $CustomersCount--;
        }
        
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}

    echo $C->getColoredString('[END] Deleting Customers.', 'blue')."\n";

    
