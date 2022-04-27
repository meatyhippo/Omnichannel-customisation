<?php

include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;
$duplicates = [];
$unique = [];

$C = new CLIColors();
echo $C->getColoredString('[START] Deleting duplicate product images.', 'blue')."\n";
echo $C->getColoredString('[INFO] Be aware this deletes ALL duplicate product images.', 'red')."\n";

 $API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
 $API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
 $API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
 $API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');


//Setting Up the API Connection
try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $ProductsCount = $ApiC->products->count();

    
    echo $C->getColoredString("[INFO] ".$ProductsCount." needs to be processed.","yellow")."\n";

    $ProductsCountPages = ceil($ProductsCount / $ApiLimit);

    for ($ProductsCountPage = 1; $ProductsCountPage <= $ProductsCountPages; $ProductsCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);
        $Params['page'] = $ProductsCountPage;
        $Params['limit'] = $ApiLimit;

        $Products = $ApiC->products->get(null, $Params);

        $ApiRequestsCount++;

        foreach ($Products as $rKey => $rValue) {
            $product_id = $rValue['id'];
            echo $C->getColoredString($ProductsCount.". Investigating product images for product id ".$product_id." ")."\n";
            Helper::checkAPISleep($ApiRequestsCount);
           
            $ProductImages = $ApiC->productsImages->get($product_id);
            $totalImages = count($ProductImages);
            $unique = [];
            $duplicates = [];

            if (count($ProductImages) > 0 ) {
                 echo $C->getColoredString("   ".$totalImages . " Image(s) found ")."\n";
                foreach($ProductImages AS $image){
                        Helper::checkAPISleep($ApiRequestsCount);
                        $ApiRequestsCount++;
                    if (!in_array($image['title'], $unique)) {
                        $unique[] = $image['title'];
                        continue;
                    }
                        $duplicates[] = $image;
                }
                if(count($duplicates)){
                    foreach($duplicates as $duplicate){
                        $dup_img_id = $duplicate['id'];
                        echo $C->getColoredString(" Delete Image: ".$dup_img_id." ");
                        Helper::checkAPISleep($ApiRequestsCount);
                        try {
                            $ApiC->productsImages->delete($product_id, $dup_img_id);
                            echo $C->getColoredString("[DONE]", "green")."\n";
                        } catch (Exception $e) {
                            echo $C->getColoredString(" [ERROR] ".$e->getMessage(), "red")."\n";
                        }
                    }
                }
            }else{
                 echo $C->getColoredString( "No image(s)", "yellow");
            }
            $ApiRequestsCount++;
            $ProductsCount--;
        }
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
    echo $C->getColoredString('[END] Deleting duplicate product images.', 'blue')."\n";