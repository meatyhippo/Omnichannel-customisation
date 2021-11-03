<?php

class Helper {

    public static function getNextWorkingDay($ShopId)
    {

        $GetShopId = new ShopModel();
        $GetShopId->setShopId($ShopId);

        $ShopDetais = $GetShopId->getShopDetailsById();
        
        $NextWeekDay = date('Y-m-d', strtotime(' +1 Weekday'));

        if ($ShopDetais['clusterId'] == 'eu1') {
            $RandTiming = rand(36000, 46800);
        } elseif ($ShopDetais['clusterId'] == 'us1') {
            $RandTiming = rand(57600, 68400);
        }

        $hours = floor($RandTiming / 3600);
        $mins = floor($RandTiming / 60 % 60);
        $secs = floor($RandTiming % 60);

        $timeFormat = sprintf('%02d:%02d:%02d', $hours, $mins, $secs);

        return $NextWeekDay . " " . $timeFormat;
    }

    public static function clusterNumberFormat($number, $clusterId){

        if($clusterId == 'eu1'){
            return number_format($number, 2, ',','.');
        }else{
            return number_format($number, 2, '.',',');
        }

    }

    public static function getRealIpAddr(){
        if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
        {
            $ip=$_SERVER['HTTP_CLIENT_IP'];
        }
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
        {
            $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        else
        {
            $ip=$_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    public static function nextEntire5Minutes($AdditionalOffset = 0){

        $TimeToNext = ceil(time()/300)*300;
        $TimeToNext = $TimeToNext-time()+$AdditionalOffset;

        return $TimeToNext;
    }

    public static function getCLIAnswer($Question){

        echo $Question." ";

        $handle = fopen ("php://stdin","r");
        $line = fgets($handle);

        $Response = trim($line);

        fclose($handle);

        return $Response;

    }

    public static function checkAPISleep($Requests, $RateLimit = 900){

        $CurrentRequests = $Requests;

        if ($Requests % $RateLimit == 0) {

            $NextFiveMinutes = Helper::nextEntire5Minutes();
            $NextFiveMinutes = $NextFiveMinutes+30;

            echo '[INFO] Script will sleep to prevent too many requests, sleeping for '.$NextFiveMinutes.' seconds';

            sleep($NextFiveMinutes); //Hour limits

            $NewRequests = 1;

        }else{
            $NewRequests = $CurrentRequests++;
        }

        return $NewRequests;
    }

    public static function isJson($string) {
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }

    public static function startsWith($haystack, $needle){
        $characterCount = count($needle);
    
        return substr( $haystack, 0, $characterCount ) === $needle;
            
    }
}


