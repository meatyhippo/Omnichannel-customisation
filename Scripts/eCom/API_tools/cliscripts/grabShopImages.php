<?php
error_reporting(E_ALL);
//define(MYSQL_VISIBLE, false);

include "../classes/header.php";

$ProductPageLimit = 250;
$Requests = 1;
$ProductsWithoutImages = 0;

$currentUser = get_current_user();

$C = new CLIColors();
echo $C->getColoredString('[START] Grabbing All Store Images.', 'blue')."\n";

$ApiCluster     = Helper::getCLIAnswer('What is the API Cluster?');
$ApiKey         = Helper::getCLIAnswer('What is the API Key?');
$ApiSecret      = Helper::getCLIAnswer('What is the API Secret?');
$ApiLanguage    = Helper::getCLIAnswer('What is the API language?');

$FilePath       = "/Users/{$currentUser}/Desktop/lightspeed/"; 

if (!file_exists($FilePath)) {
    mkdir($FilePath, 0777, true);
}
$ReportDir      = $FilePath."image_dump".date('Y-m-d')."-".time();
$CreateDir      = mkdir($ReportDir);

$ResultsFile    = fopen($ReportDir."/Results.csv", "w");
fputcsv($ResultsFile, array('Product_ID','Title','Url','Variant_ID','Variant_title','Article_code','EAN','SKU','Image'));

echo $C->getColoredString('[INFO] Working Dir Created '. $ReportDir, 'green')."\n";
$C->getFlushed();

$ApiConnection = new WebshopappApiClient($ApiCluster, $ApiKey, $ApiSecret, $ApiLanguage);

try {

    $CountProducts = $ApiConnection->products->count();

    $AmountOfProducts = $CountProducts;

    $Requests = Helper::checkAPISleep($Requests);

    echo $C->getColoredString('[INFO] ' . $CountProducts . ' products need to be processed', 'yellow') . "\n";
    $C->getFlushed();

    $Pages = ceil($CountProducts / $ProductPageLimit);

    for ($Page = 1; $Page <= $Pages; $Page++) {

        echo $C->getColoredString('[PAGE ' . $Page . ' / ' . $Pages . '] Starting new page.', 'green') . "\n";
        $C->getFlushed();

        $Params['page'] = $Page;
        $Params['limit'] = $ProductPageLimit;

        $Requests = Helper::checkAPISleep($Requests);
        $CatalogData = $ApiConnection->catalog->get(null, $Params);

        foreach ($CatalogData AS $aKey => $aValue) {

            $RowData = array();

            $RowData[] = $CatalogData[$aKey]['id'];
            $RowData[] = $CatalogData[$aKey]['title'];
            $RowData[] = $CatalogData[$aKey]['url'];

            $ImagesToProcess = count($CatalogData[$aKey]['images']);

            echo $C->getColoredString($AmountOfProducts . ". Processing product " . $CatalogData[$aKey]['title']) . "\n";
            echo $C->getColoredString(" - Found " . $ImagesToProcess . " image(s) to process") . "\n";

            if($ImagesToProcess < 1){
                $ProductsWithoutImages++;
            }

            $C->getFlushed();

            $ProductImages = array();

            foreach ($CatalogData[$aKey]['images'] AS $iKey => $iValue) {

                echo $C->getColoredString(' - Image: ' . $CatalogData[$aKey]['images'][$iKey]['src']);

                $OriginUrl = $CatalogData[$aKey]['images'][$iKey]['src'];

                $DestinationFileName = $CatalogData[$aKey]['images'][$iKey]['id'] . "_" . $CatalogData[$aKey]['url'] . ".jpg";

                $DestinationUrl = $ReportDir . "/" . $DestinationFileName;

                if (file_put_contents($DestinationUrl, file_get_contents($OriginUrl))) {
                    echo $C->getColoredString(' [SUCCESS]', 'green') . "\n";
                    $ProductImages[] = $DestinationFileName;

                } else {
                    echo $C->getColoredString(' [FAILED]', 'red') . "\n";
                }

            }

            foreach ($CatalogData[$aKey]['variants'] AS $vKey => $vValue) {

                $CSVData = $RowData;

                $CSVData[] = $CatalogData[$aKey]['variants'][$vKey]['id'];
                $CSVData[] = $CatalogData[$aKey]['variants'][$vKey]['title'];
                $CSVData[] = $CatalogData[$aKey]['variants'][$vKey]['articleCode'];
                $CSVData[] = $CatalogData[$aKey]['variants'][$vKey]['ean'];
                $CSVData[] = $CatalogData[$aKey]['variants'][$vKey]['sku'];

                foreach ($ProductImages AS $pKey => $pValue) {

                    $CSVData[] = $pValue;

                }
                fputcsv($ResultsFile, $CSVData);
            }

            $AmountOfProducts--;
        }
    }
    fclose($ResultsFile);

}catch (Exception $e){
    echo $C->getColoredString('[API ERROR] '. $e->getMessage(), 'red')."\n";
}
echo $C->getColoredString('[END] Grabbing All Store Images.', 'blue')."\n";
echo $C->getColoredString('[INFO] result dir '. $ReportDir, 'green')."\n";

echo $C->getColoredString('[INFO] Folder will be opened', 'green')."\n";


exec ("open ".$ReportDir);

$C->getFlushed();