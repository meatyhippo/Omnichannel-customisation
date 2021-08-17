<?php

include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Getting Discount Codes.', 'blue') . "\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

$ResultsFile    = fopen("../inputs/grabDiscounts.csv", "w");

fputcsv($ResultsFile, array('DiscountID', 'DiscountCode','Status','Type','Discount'));

$trueFalse = [
    '0' => 'false',
    '1' => 'true'
];

$ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
try {

    $DiscountCount = $ApiC->discounts->count();

    echo $C->getColoredString("[INFO] " . $DiscountCount . " needs to be processed.", "yellow") . "\n";

    $DiscountCountPages = ceil($DiscountCount / $ApiLimit);

    $results = [];

    for ($DiscountCountPage = 1; $DiscountCountPage <= $DiscountCountPages; $DiscountCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $DiscountCountPage;
        $Params['limit'] = $ApiLimit;

        $Discounts = $ApiC->discounts->get(null, $Params);

        $ApiRequestsCount++;

        foreach ($Discounts as $discount) {

            echo $C->getColoredString($DiscountCount . ". Discounts ID " . $discount['id'] . " ". $discount['code'], "green");
            Helper::checkAPISleep($ApiRequestsCount);

            $results = [
                'discount_id' => $discount['id'],
                'code' => $discount['code'],
                'status' => $trueFalse[$discount['isActive']],
                'type' => $discount['type'],
                'discount' => $discount['discount']
            ];

            fputcsv($ResultsFile, $results);

            $ApiRequestsCount++;
            echo $C->getColoredString(" [DONE]", "green") . "\n";

            $DiscountCount--;
        }
    }
} catch (Exception $e) {

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red') . "\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red') . "\n";
}
fclose($ResultsFile);
echo $C->getColoredString('[END] Getting Discount Codes.', 'blue') . "\n";

