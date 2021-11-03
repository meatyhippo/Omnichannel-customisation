<?php
//Lucien
    include "../classes/header.php";

    $SubscriberCount = 0;
    $RequestCount  = 1;
    $CreatedSubscriber = array();
    $unCreatedSubscriber = array();

    $C = new CLIColors();

    echo $C->getColoredString('[START] Adding subscribers.', 'blue')."\n";

//Grabbing the API Details
    $API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
    $API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
    $API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
    $API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

//Discount Details
    $CSVFilename             = Helper::getCLIAnswer('Provide the filename of csv:');

    $SourceFile = '../inputs/'.$CSVFilename;

    if(!file_exists($SourceFile)){
        echo $C->getColoredString('[FATAL ERROR] Source file doesn\'t exist' ,'red')."\n";
        exit;
    }

    $handle = fopen($SourceFile, "rb");

//Count the items to be processed
    while(!feof($handle)){

        $line = fgets($handle);

        if(strlen(trim($line)) > 2){
            $SubscriberCount++;
        }

    }
    echo $C->getColoredString('[INFO] Found '.$SubscriberCount.' subscribers to be processed', 'yellow')."\n";

//Setting Up the API Connection
    try {

        $Api = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

        $handle = fopen($SourceFile, "rb");

        //Loop through CSV to grab the subscribers
        while(!feof($handle)){

            $line = fgets($handle);

            if(strlen(trim($line)) > 2){

                $columns = explode(',', trim($line));

                //$SubscriberParams['createdAt'] = $columns[0];
                $SubscriberParams['email'] = $columns[0];
                $SubscriberParams['firstname'] = $columns[1];
                $SubscriberParams['lastname'] = $columns[2];
                $SubscriberParams['isConfirmed'] = true;
                $SubscriberParams['doNotifyConfirmed'] = false;
                $SubscriberParams['language'] = $columns[3];

                echo $C->getColoredString($SubscriberCount .'. Creating subscriber '.$line);

                try {

                    $RequestCount++;

                    Helper::checkAPISleep($RequestCount);

                    $SubscriberResult = $Api->subscriptions->create($SubscriberParams);

                    echo $C->getColoredString('[SUCCESS] id '.$SubscriberResult['id'].' has been created', 'green')."\n";

                    $CreatedSubscriber[] = $SubscriberResult['id'];

                } catch (Exception $e){
                    echo $C->getColoredString('[ERROR] '.$e->getMessage(),'red')."\n";                    
                }
                $SubscriberCount--;
            }
        }

    } catch (Exception $e){

        echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
        echo $C->getColoredString('[ERROR]' . $e->getMessage(), 'red')."\n";
    }

    echo $C->getColoredString('[RESULTS] A list of created subscriber id\'s', 'cyan')."\n";
    echo implode( ', ',$CreatedSubscriber)."\n";

    echo $C->getColoredString('[END] Adding subscriber.', 'blue')."\n";
