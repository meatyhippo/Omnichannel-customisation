<?php
error_reporting(E_ALL);
//define(MYSQL_VISIBLE, false);

include "../classes/header.php";

$ApiLimit         = 250;
$ApiRequestsCount = 1;

$currentUser = get_current_user();

$C = new CLIColors();
echo $C->getColoredString('[START] Grabbing All File urls', 'blue') . "\n";

$ApiCluster     = Helper::getCLIAnswer('What is the API Cluster?');
$ApiKey         = Helper::getCLIAnswer('What is the API Key?');
$ApiSecret      = Helper::getCLIAnswer('What is the API Secret?');
$ApiLanguage    = Helper::getCLIAnswer('What is the API language?');

$FilePath       = "/Users/{$currentUser}/Desktop/lightspeed/";

if (!file_exists($FilePath)) {
    mkdir($FilePath, 0777, true);

$ReportDir      = $FilePath."image_dump".date('Y-m-d')."-".time();
$CreateDir      = mkdir($ReportDir);
}
$ResultsFile    = fopen($FilePath . "file_urls.csv", "w");

fputcsv($ResultsFile, array('ID','Title','Type', 'Source'));

try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $FileCount = $ApiC->files->count();
        
    echo $C->getColoredString("[INFO] ".$FileCount." needs to be processed.","yellow")."\n";

    $FileCountPages = ceil($FileCount / $ApiLimit);

    $results = [];

    for ($FileCountPage = 1; $FileCountPage <= $FileCountPages; $FileCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $FileCountPage;
        $Params['limit'] = $ApiLimit;

        $Files = $ApiC->files->get(null, $Params);

        $ApiRequestsCount++;

        foreach ($Files as $fKey => $fValue) {

            echo $C->getColoredString($FileCount.". Files ID ".$Files[$fKey]['id']." ", "green");
            //echo $C->getColoredString($FileCount.". Files ID ".$file['id']." ", "green");
            Helper::checkAPISleep($ApiRequestsCount);

            $RowData = array();

            $RowData[] = $Files[$fKey]['id'];
            $RowData[] = $Files[$fKey]['title'];
            $RowData[] = $Files[$fKey]['type'];
            $RowData[] = $Files[$fKey]['src'];

            $ImagesToProcess = count($Files[$fKey]['src']);

            echo $C->getColoredString(" - Found " . $ImagesToProcess . " image(s) to process") . "\n";
            
            $C->getFlushed();

            $FileImages = array();

            foreach ($Files[$fKey]['src'] AS $iKey => $iValue) {

                echo $C->getColoredString(' - Image: ' . $Files[$fKey]['src']);

                $OriginUrl = $Files[$fKey]['src'];

                $DestinationFileName = $Files[$fKey]['src'] . "_" . $CatalogData[$aKey]['url'] . ".jpg";

                $DestinationUrl = $ReportDir . "/" . $DestinationFileName;

                if (file_put_contents($DestinationUrl, file_get_contents($OriginUrl))) {
                    echo $C->getColoredString(' [SUCCESS]', 'green') . "\n";
                    $FileImages[] = $DestinationFileName;

                } else {
                    echo $C->getColoredString(' [FAILED]', 'red') . "\n";
                }
            }
            fputcsv($ResultsFile, $RowData);

            $ApiRequestsCount++;
            echo $C->getColoredString(" [DONE]","green")."\n"; 
            $FileCount--;
        }  
    }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}
fclose($ResultsFile);
echo $C->getColoredString('[END] Grabbing All File urls.', 'blue')."\n";


echo $C->getColoredString('[INFO] result dir '. $ReportDir, 'green')."\n";

echo $C->getColoredString('[INFO] Folder will be opened', 'green')."\n";

exec ("open ".$ReportDir);

$C->getFlushed();
