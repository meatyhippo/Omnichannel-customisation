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

$ResultsFile    = fopen($FilePath . "file_urls.csv", "w");
fputcsv($ResultsFile, array('ID','Title','Type', 'Source'));

echo $C->getColoredString('[INFO] Working Dir Created '. $ReportDir, 'green')."\n";
$C->getFlushed();

$ApiConnection = new WebshopappApiClient($ApiCluster, $ApiKey, $ApiSecret, $ApiLanguage);

try {

    $CountFiles = $ApiConnection->files->count();

    $AmountOfFiles = $CountFiles;

    $Requests = Helper::checkAPISleep($Requests);

    echo $C->getColoredString('[INFO] ' . $CountFiles . ' files need to be processed', 'yellow') . "\n";
    $C->getFlushed();

    $Pages = ceil($CountFiles / $ProductPageLimit);

    for ($Page = 1; $Page <= $Pages; $Page++) {

        echo $C->getColoredString('[PAGE ' . $Page . ' / ' . $Pages . '] Starting new page.', 'green') . "\n";
        $C->getFlushed();

        $Params['page']  = $Page;
        $Params['limit'] = $ProductPageLimit;

        $Requests = Helper::checkAPISleep($Requests);
        $FilesData = $ApiConnection->files->get(null, $Params);

        foreach ($FilesData AS $aKey => $aValue) {

            $RowData = array();

            $RowData[] = $FilesData[$aKey]['id'];
            $RowData[] = $FilesData[$aKey]['title'];
            $RowData[] = $FilesData[$aKey]['extension'];
            $RowData[] = $FilesData[$aKey]['src'];

            $ImagesToProcess = count($FilesData[$aKey]['src']);

            echo $C->getColoredString($AmountOfFiles . ". Processing files " . $FilesData[$aKey]['title']) . "\n";
            echo $C->getColoredString(" - Found " . $ImagesToProcess . " image(s) to process") . "\n";

            // if($ImagesToProcess < 1){
            //     $ProductsWithoutImages++;
            // }

            // $C->getFlushed();

            // $ProductImages = array();

            // foreach ($FilesData[$aKey]['images'] AS $iKey => $iValue) {

            //     echo $C->getColoredString(' - Image: ' . $FilesData[$aKey]['images'][$iKey]['src']);

            //     $OriginUrl = $FilesData[$aKey]['images'][$iKey]['src'];

            //     $DestinationFileName = $FilesData[$aKey]['images'][$iKey]['id'] . "_" . $FilesData[$aKey]['url'] . ".jpg";

            //     $DestinationUrl = $ReportDir . "/" . $DestinationFileName;

            //     if (file_put_contents($DestinationUrl, file_get_contents($OriginUrl))) {
            //         echo $C->getColoredString(' [SUCCESS]', 'green') . "\n";
            //         $ProductImages[] = $DestinationFileName;

            //     } else {
            //         echo $C->getColoredString(' [FAILED]', 'red') . "\n";
            //     }

            // }

            // foreach ($FilesData[$aKey]['variants'] AS $vKey => $vValue) {

            //     $CSVData = $RowData;

            //     $CSVData[] = $FilesData[$aKey]['variants'][$vKey]['id'];
            //     $CSVData[] = $FilesData[$aKey]['variants'][$vKey]['title'];
            //     $CSVData[] = $FilesData[$aKey]['variants'][$vKey]['articleCode'];
            //     $CSVData[] = $FilesData[$aKey]['variants'][$vKey]['ean'];
            //     $CSVData[] = $FilesData[$aKey]['variants'][$vKey]['sku'];

            //     foreach ($ProductImages AS $pKey => $pValue) {

            //         $CSVData[] = $pValue;

            //     }
            //     fputcsv($ResultsFile, $CSVData);
            // }

            $AmountOfFiles--;
        }
    }
    //fclose($ResultsFile);

}catch (Exception $e){
    echo $C->getColoredString('[API ERROR] '. $e->getMessage(), 'red')."\n";
}
echo $C->getColoredString('[END] Grabbing All Store Images.', 'blue')."\n";
echo $C->getColoredString('[INFO] result dir '. $ReportDir, 'green')."\n";

echo $C->getColoredString('[INFO] Folder will be opened', 'green')."\n";

//exec ("open ".$ReportDir);

$C->getFlushed();