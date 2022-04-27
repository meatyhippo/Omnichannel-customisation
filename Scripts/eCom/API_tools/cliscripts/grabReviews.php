<?php

    include "../classes/header.php";

    $PageLimit        = 250;
    $ApiRequestsCount = 1;

    $C = new CLIColors();
    echo $C->getColoredString('[START] Getting Customer type.', 'blue') . "\n";

// $API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
// $API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
// $API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
// $API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');



    $ResultsFile = fopen("../inputs/Reviews_lucientest.csv", "w");
    fputcsv($ResultsFile, ['Name', 'Title', 'Content', 'Score', 'Email', 'CreatedAt']);

    $counter  = 1;
    $rowCount = 0;

    try {

        $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

        $ReviewsCount = $ApiC->reviews->count();

        echo $C->getColoredString("[INFO] " . $ReviewsCount . " needs to be processed.", "yellow") . "\n";

        $ReviewCountPages = ceil($ReviewsCount / $PageLimit);

        for ($ReviewCountPage = 1; $ReviewCountPage <= $ReviewCountPages; $ReviewCountPage++) {

            Helper::checkAPISleep($ApiRequestsCount);

            $Params['page']  = $ReviewCountPage;
            $Params['limit'] = $PageLimit;

            $Reviews = $ApiC->reviews->get(null, $Params);

            $ApiRequestsCount++;

            foreach ($Reviews as $review => $value) {

                $customerId = $value['customer']['resource']['id'];

                try {
                    Helper::checkAPISleep($ApiRequestsCount);

                    $product  = $ApiC->products->get($value['product']['resource']['id']);
                    $customer = $ApiC->customers->get($customerId);

                    $variant = $ApiC->variants->get(null, [
                        'product' => $product['id']
                    ]);

                    $ApiRequestsCount++;

                } catch (\Exception $e) {
                    echo $e->getMessage() . "\n";
                    continue;
                }

                $review = $ApiC->reviews->get(null, [
                    'customer' => $customerId
                ]);

                $row = [
                    $value['name'],
                    $product['title'],
                    $value['content'],
                    $value['score'],
                    $customer['email'],
                    $value['createdAt']
                ];

                fputcsv($ResultsFile, $row);
                $ReviewsCount--;
                echo "Review {$ReviewsCount}\n";

                sleep(1);
            }
        }
    } catch (Exception $e) {
        echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red') . "\n";
        echo $C->getColoredString('[ERROR]' . $e->getMessage() . $e->getTraceAsString(), 'red') . "\n";
    }
    fclose($ResultsFile);
    echo $C->getColoredString('[END] Getting Customer type.', 'blue') . "\n";