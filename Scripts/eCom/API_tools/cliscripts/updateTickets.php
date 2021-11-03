<?php

include "../classes/header.php";

$ApiLimit               = 250;
$ApiRequestsCount       = 1;

$C = new CLIColors();
echo $C->getColoredString('[START] Updating tickets.', 'blue') . "\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

//Setting Up the API Connection
try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

    $TicketsCount = $ApiC->tickets->count();

    echo $C->getColoredString("[INFO] " . $TicketsCount . " needs to be processed.", "yellow") . "\n";

    $TicketsCountPages = ceil($TicketsCount / $ApiLimit);

    for ($TicketsCountPage = 1; $TicketsCountPage <= $TicketsCountPages; $TicketsCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $TicketsCountPage;
        $Params['limit'] = $ApiLimit;

        $Tickets = $ApiC->tickets->get(null, $Params);

        $ApiRequestsCount++;

        foreach ($Tickets as $rKey => $rValue) {

            echo $C->getColoredString($TicketsCount . ". Updating product " . $Tickets[$rKey]['id'] . " ", "green");
            Helper::checkAPISleep($ApiRequestsCount);
            $isAnswered = $Tickets[$rKey]['isAnswered'];
            if (!$isAnswered) {
                $ApiC->tickets->update($Tickets[$rKey]['id'], [
                    'isAnswered' => true
                ]);
            }
            $ApiRequestsCount++;

            echo $C->getColoredString(" [DONE]", "green") . "\n";
            $TicketsCount--;
        }
    }
} catch (Exception $e) {

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red') . "\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red') . "\n";
}
echo $C->getColoredString('[END] Updating Tickets.', 'blue') . "\n";
