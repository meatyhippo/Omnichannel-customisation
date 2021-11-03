<?php

include "../classes/header.php";

$PageLimit               = 250;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Getting Customer type.', 'blue')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $CustomersCount = $ApiC->customers->count();

        
    echo $C->getColoredString("[INFO] ".$CustomersCount." needs to be processed.","yellow")."\n";

    $CustomersCountPages = ceil($CustomersCount / $PageLimit);


    for ($CustomersCountPage = 1; $CustomersCountPage <= $CustomersCountPages; $CustomersCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $CustomersCountPage;
        $Params['limit'] = $PageLimit;

        $Customers = $ApiC->customers->get(null, $Params);
        
        $ApiRequestsCount++;

        foreach ($Customers AS $rKey => $rValue) {

            echo $C->getColoredString($CustomersCount.". Sending customers reset link ".$Customers[$rKey]['id']." ", "green");
            Helper::checkAPISleep($ApiRequestsCount);

			$ApiC->customers->update($Customers[$rKey]['id'],[
                'doNotifyPassword' => true
            ]);

            $ApiRequestsCount++;
                    
            echo $C->getColoredString(" [DONE]","green")."\n";
            $CustomersCount--;
        }
        
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
echo $C->getColoredString('[END] Sending customers reset link.', 'blue')."\n";

//8f2c586d97d708ebb490d1a913321e67
//93912a6d3baa03ac3c3c2229451857f4