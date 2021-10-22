$(document).ready(function () {
	window.params = {};
	location.search.substring(1).split("&").forEach((item,i) => {
		params[item.split('=')[0]] = item.split('=')[1];
	});
	/**/console.log(params);
	$('#loyalty').html('<div class="">\
					   accountID = '+params.accountID+'<br>\
					   customerID = '+params.customerID+'<br>\
					   employeeID = '+params.employeeID+'<br>\
					   registerID = '+params.registerID+'<br>\
					   returnURL = '+decodeURIComponent(params.returnURL)+'<br>\
					   saleID = '+params.saleID+'<br>\
					   shopID = '+params.shopID+'<br>\
					   systemUserID = '+params.systemUserID+'<br>\
					   type = '+params.type+'<br>\
					   </div>\
					   <a href="'+decodeURIComponent(params.returnURL)+'" title="returnURL">Return to POS</a><br>\
					   <button onclick="postDataToWebhook(params)">Send to Integromat</button>\
');
})
//JS post to webhook
function postDataToWebhook(params){
	//url to your webhook
	var webHookUrl="https://hook.integromat.com/jh5ecaoqaix4xuvl3turxk41nl4gk2k3"+location.search;
  
  	//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
	var oReq = new XMLHttpRequest();
	var myJSONStr = params;
  
	//register method called after data has been sent method is executed
	oReq.addEventListener("load", reqListener);
	oReq.open("POST", webHookUrl, true);
	//oReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	oReq.send();
}
//callback method after webhook is executed
function reqListener () {
	/**/console.log(this);
  	console.log(this.responseText);
}