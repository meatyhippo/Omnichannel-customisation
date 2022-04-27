<?php

include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Getting Google Categories.', 'blue')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

$ResultsFile    = fopen("google_categories.csv", "w");

fputcsv($ResultsFile, array('ProductID','Google_cat_nl','Product_name'));

try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $ProductCount = $ApiC->products->count();
        
    echo $C->getColoredString("[INFO] ".$ProductCount." needs to be processed.","yellow")."\n";

    $ProductCountPages = ceil($ProductCount / $ApiLimit);

    $results = [];

    for ($ProductCountPage = 1; $ProductCountPage <= $ProductCountPages; $ProductCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $ProductCountPage;
        $Params['limit'] = $ApiLimit;

        $Products = $ApiC->products->get(null, $Params);

        $ApiRequestsCount++;

        foreach ($Products as $product) {
            echo $C->getColoredString($ProductCount.". Products ID ".$product['id']." ", "green");
            Helper::checkAPISleep($ApiRequestsCount);

            $metafields = $ApiC->productsMetafields->get($product['id']);
            
            foreach ($metafields as $meta) {
                if($meta['key'] === 'google_product_category_nl'){
                    $results = [
                        'product_id' => $product['id'],
                        'google_product_category_nl' => $meta['value'],
                        'product_name' => $product['title']
                    ];
                    //print_r($results);
                    break;
                }
            }
                fputcsv($ResultsFile, $results);
            $ApiRequestsCount++;
            echo $C->getColoredString(" [DONE]","green")."\n";                 
            
            $ProductCount--;
        }  
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
fclose($ResultsFile);
echo $C->getColoredString('[END] Getting Google Categories.', 'blue')."\n";