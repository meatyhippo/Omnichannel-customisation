// add account profiles
let accounts = [
	{
		"name":"API account profile",
		"code":"AAP",
		"deliveryMode":"NONE",
		"deliveryDelay=NOTUSED&":"",
		"minDeliveryDelay=-1&":"",
		"completionMode=IMMEDIATE&":"",
		"_consumerRequired=&":"",
		"_deliverySlipOnReceipt=&":"",
		"_printNoteOnCreation=&":"",
		"_forceNoPrintOnlineOrders=&":"",
		"_playSoundOnOnlineOrders=&":""
	}
]
fetch("https://manager.trial.lsk.lightspeed.app/configuration/saveTag", {
	"headers": {
		"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
		"content-type": "application/x-www-form-urlencoded",
		"sec-fetch-dest": "document",
		"sec-fetch-mode": "navigate",
		"sec-fetch-site": "same-origin",
		"sec-fetch-user": "?1",
		"sec-gpc": "1",
		"upgrade-insecure-requests": "1"
	},
	"body": "id=&"+
	"name=testttttttt&"+
	"code=testttttttt&"+
	"commitScriptUrl=&"+"_sticky=&"+
	"_changeTaxOnExistingItems=&"+
	"deliveryMode=NONE&"+
	"deliveryDelay=NOTUSED&"+
	"minDeliveryDelay=-1&"+
	"completionMode=IMMEDIATE&"+
	"_consumerRequired=&"+
	"_deliverySlipOnReceipt=&"+
	"_printNoteOnCreation=&"+
	"_forceNoPrintOnlineOrders=&"+
	"_playSoundOnOnlineOrders=&"+
	"signageDeviceIpAddress=&"+
	"serviceChargeProductId=&"+
	"serviceChargePercent=0&"+
	"schedules.0._days=&"+
	"schedules.0.days=&"+
	"schedules.0._days=&"+
	"schedules.0._days=&"+
	"schedules.0._days=&"+
	"schedules.0._days=&"+
	"schedules.0._days=&"+
	"schedules.0._days=&"+
	"schedules.0._days=&"+
	"schedules.0.startTime=0&"+
	"schedules.0.endTime=0&"+
	"schedules.0._useWhenDirect=&"+
	"schedules.0.useWhenDirect=true&"+
	"schedules.0._useWhenAccount=&"+
	"schedules.0.useWhenAccount=true&"+
	"schedules.0._active=&"+
	"schedules.0.active=true",
	"method": "POST",
});