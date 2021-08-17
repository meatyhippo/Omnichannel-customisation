<?php

include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Getting Customer type.', 'blue')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

$ReportDir = '../inputs/';
$ResultsFile    = fopen($ReportDir."Results.csv", "w");

fputcsv($ResultsFile, array('Customer_ID', 'First_Name', 'Last_Name','Email','Type'));

$counter = 1;
$rowCount = 0;

try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

    $CustomersCount = $ApiC->customers->count();
   
    echo $C->getColoredString("[INFO] ".$CustomersCount." needs to be processed.","yellow")."\n";

    $CustomersCountPages = ceil($CustomersCount / $ApiLimit);


    for ($CustomersCountPage = 1; $CustomersCountPage <= $CustomersCountPages; $CustomersCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $CustomersCountPage;
        $Params['limit'] = $ApiLimit;

        $Customers = $ApiC->customers->get(null, $Params);
        
        $ApiRequestsCount++;

        foreach ($Customers AS $rKey => $rValue) {

            echo $C->getColoredString($CustomersCount.". Getting customers type ".$Customers[$rKey]['id']." ", "green");
            Helper::checkAPISleep($ApiRequestsCount);

			$ApiC->customers->get($Customers[$rKey]['id']);

			$row = [
				$Customers[$rKey]['id'],
				$Customers[$rKey]['firstname'],
				$Customers[$rKey]['lastname'],
				$Customers[$rKey]['email'],
				$Customers[$rKey]['type'],
			];
			
			fputcsv($ResultsFile, $row, ",");

            $ApiRequestsCount++;
                    
            echo $C->getColoredString(" [DONE]","green")."\n";
            $CustomersCount--;
        }
        
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
fclose($ResultsFile);
exec ("open ".$ReportDir);

echo $C->getColoredString('[END] Getting Customer type.', 'blue')."\n";