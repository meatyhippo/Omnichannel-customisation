<?php
$u = '9931f19b9694cca99b56fbd73019bd40';//Helper::getCLIAnswer('What is the API Key?');
$p = '06f8e9c855c20ed021ded0c9dccebde6';
$auth = $u.':'.$p;
$l = 'us';
$taxes = array(
	'high' => array(
		'be' => 0.21,
		'at' => 0.20,
		'bg' => 0.20,
		'hr' => 0.25,
		'cy' => 0.19,
		'cz' => 0.21,
		'dk' => 0.25,
		'ee' => 0.20,
		'fi' => 0.24,
		'fr' => 0.20,
		'de' => 0.19,
		'gr' => 0.24,
		'hu' => 0.27,
		'ie' => 0.23,
		'it' => 0.22,
		'lv' => 0.21,
		'lt' => 0.21,
		'lu' => 0.17,
		'mt' => 0.18,
		'nl' => 0.21,
		'pl' => 0.23,
		'pt' => 0.23,
		'ro' => 0.20,
		'sk' => 0.20,
		'si' => 0.22,
		'es' => 0.21,
		'se' => 0.25,
	),
	'low' => array(
		'be' => 0.12,
		'at' => 0,10,
		'bg' => 0.09,
		'hr' => 0.13,
		'cy' => 0.09,
		'cz' => 0.15,
		'dk' => 0.25,
		'ee' => 0.09,
		'fi' => 0.14,
		'fr' => 0.10,
		'de' => 0.07,
		'gr' => 0.13,
		'hu' => 0.18,
		'ie' => 0.135,
		'it' => 0.10,
		'lv' => 0.12,
		'lt' => 0.09,
		'lu' => 0.14,
		'mt' => 0.07,
		'nl' => 0.06,
		'pl' => 0.08,
		'pt' => 0.13,
		'ro' => 0.09,
		'sk' => 0.10,
		'si' => 0.095,
		'es' => 0.10,
		'se' => 0.12, 
	)
);
foreach ($taxes as $taxlevel => $country) {
	create_tax($taxlevel, $country);
}
function create_tax($taxlevel, $country){
	global $auth, $l;
	$curl = curl_init();
	curl_setopt_array($curl, array(
	CURLOPT_URL => 'https://'.$auth.'@api.webshopapp.com/'.$l.'/taxes.json',
	CURLOPT_POST => 1,
	CURLOPT_RETURNTRANSFER => 1,
	CURLOPT_POSTFIELDS =>'{
		"tax": {
			"isDefault": false,
			"rate": -0.21,
			"title": "EU threshold tax '.$taxlevel.'"
		}
	}'
	));
	$response = curl_exec($curl);
	$x = json_decode($response, true);
	var_dump($x);
	$taxid = $x['tax']?$x['tax']["id"]:'';
	curl_close($curl);
	if ($taxid>1){
		foreach ($country as $code => $rate) {
		overrides($taxlevel, $taxid, $code, $rate);
	}}
}
function overrides($taxlevel, $taxid, $code, $rate){
	global $auth, $l;
	$ch = curl_init();
	curl_setopt_array($ch, array(
	CURLOPT_URL => "https://$auth@api.webshopapp.com/$l/taxes/$taxid/overrides.json",
	CURLOPT_POST => 1,
	CURLOPT_RETURNTRANSFER => 1,
	CURLOPT_POSTFIELDS =>'{
		"taxOverride": {
		  "countryCode": "'.$code.'",
		  "rate": '.$rate.'
		}
	  }'
	));
	$response = curl_exec($ch);
	if (curl_errno($ch)) {
		$x = json_decode($response, true);
		var_dump($x);	
	} else {
		echo "tax lvl $taxlevel - region $code succesful($rate)","\n";
	}
	curl_close($ch);
}
?>
