<?php 

include "../classes/header.php";

$ApiLimit                 = 250;
$ApiRequestsCount         = 1;

    $CurrStatus = 'cancelled'; //on_hold, off_hold, cancelled, processing_awaiting_payment
    $NewStatus = 'on_hold'; //on_hold, off_hold, cancelled
    $days = 5;

$C = new CLIColors();
echo $C->getColoredString("[START] Order cancelled after {$days} days.", 'blue')."\n";

// //Grabbing the API Details
$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

try {
    $Api = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

    $OrderCount = $Api->orders->count();

    echo $C->getColoredString("[INFO] " . $OrderCount . " Total Orders.", "yellow") . "\n";

    $OrderCountPages = ceil($OrderCount / $ApiLimit);

    for ($OrderCountPage = 1; $OrderCountPage <= $OrderCountPages; $OrderCountPage++) {
    
        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $OrderCountPage;
        $Params['limit'] = $ApiLimit;

        $ApiRequestsCount++;

         $UnpaidOrders = $Api->orders->get(null,[
             'status' => $CurrStatus
         ]);

        $UnpaidOrderCount = 0;
         foreach ($UnpaidOrders as $uKey => $uValue) {

                 if ($uValue['status'] === $CurrStatus) {

                     Helper::checkAPISleep($ApiRequestsCount);

                     $OrderID = $uValue['id'];
                     $OrderStatus = $uValue['status'];
                     $OrderCreatedAt = $uValue['createdAt'];

                     $days_delay = datetimeDiff(date('Y-m-d'),$OrderCreatedAt) . "\n";

                     if ($days_delay > $days){

                         Helper::checkAPISleep($ApiRequestsCount);
                         $Api->orders->update($OrderID,[
                            'status' => $NewStatus
                        ]);
                         echo $C->getColoredString(" [DONE]","green")."\n";
                         $ApiRequestsCount++;
                         $UnpaidOrderCount++;
                     }
                     echo $C->getColoredString("Order: ".$OrderID." is set to " . $NewStatus, "green");
                     echo $UnpaidOrderCount;
                 }
         }
        echo $C->getColoredString("No orders are set to " . $NewStatus, "pink");
        return;
    }
} catch (Exception $e) {
    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
}

function datetimeDiff($dt1, $dt2){

        $t1 = strtotime($dt1);
        $t2 = strtotime($dt2);

        $dtd = new stdClass();
        $dtd->interval = $t2 - $t1;
        $dtd->total_sec = abs($t2-$t1);
        $dtd->total_min = floor($dtd->total_sec/60);
        $dtd->total_hour = floor($dtd->total_min/60);
        $dtd->total_day = floor($dtd->total_hour/24);

        $dtd->day = $dtd->total_day;
        $dtd->hour = $dtd->total_hour -($dtd->total_day*24);
        $dtd->min = $dtd->total_min -($dtd->total_hour*60);
        $dtd->sec = $dtd->total_sec -($dtd->total_min*60);
        return $dtd->day;
}
