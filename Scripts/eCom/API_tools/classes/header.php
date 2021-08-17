<?php

if(end($argv) == 'debug') {

    error_reporting(E_ALL);
    define(MYSQL_VISIBLE, true);
}

include "../classes/modelmysql.class.php";
include "../classes/helper.class.php";
include "../classes/clicolors.class.php";
include "../classes/webshopappclient.php";

