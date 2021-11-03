<?php
$u = '9931f19b9694cca99b56fbd73019bd40';//Helper::getCLIAnswer('What is the API Key?');
$p = '06f8e9c855c20ed021ded0c9dccebde6';
$auth = $u.':'.$p;
$l = 'us';
$taxes = array(
	'Belgium' => 0.21,
	'Austria' => 0.20,
	'Bulgaria' => 0.20,
	'Croatia' => 0.25,
	'Cyprus' => 0.19,
	'Czechia' => 0.21,
	'Denmark' => 0.25,
	'Estonia' => 0.20,
	'Finland' => 0.24,
	'France' => 0.20,
	'Germany' => 0.19,
	'Greece' => 0.24,
	'Hungary' => 0.27,
	'Ireland' => 0.23,
	'Italy' => 0.22,
	'Latvia' => 0.21,
	'Lithuania' => 0.21,
	'Luxembourg' => 0.17,
	'Malta' => 0.18,
	'Netherlands, The' => 0.21,
	'Poland' => 0.23,
	'Portugal' => 0.23,
	'Romania' => 0.20,
	'Slovakia' => 0.20,
	'Slovenia' => 0.22,
	'Spain' => 0.21,
	'Sweden' => 0.25,
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
			"rate": '.$taxlvl.',
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
