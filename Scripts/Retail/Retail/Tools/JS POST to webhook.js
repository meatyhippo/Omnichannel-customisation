function postDataToWebhook(params){
	//url to your webhook
	var webHookUrl="https://hook.integromat.com/1sl68q8vs5senhipj9tuibca0hr8scms";

	var oReq = new XMLHttpRequest();
	var myJSONStr = params;
  
	//register method called after data has been sent method is executed
	oReq.addEventListener("load", reqListener);
	oReq.open("POST", webHookUrl, true);
	//oReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	oReq.send(params);
}
//callback method after webhook is executed
function reqListener() {
	/**/console.log(this);
  	console.log(this.responseText);
}