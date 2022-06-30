let token = document.head.querySelectorAll('meta[name="csrf-token"]')[0].getAttribute('content'),
jsondata = , //raw json data from /custom_translations.json
list = jsondata.custom_translations,
currentnr = 0; // manually looping via interval in final lines. This avoids rate limits as well as a stack overflow from using synchronous functions
function create_translation(nr){
	if(list[nr].frontend_translation==null){
		let body = {
			"custom_translation":{
				"key": list[nr].key
			}
		};
		Object.keys(list[nr]).forEach(elem=>{
			if(list[nr][elem] != null && list[nr][elem].language_id){
				console.log('object key:', elem, 'object value:', list[nr][elem].language_id);
				let key = elem;
				body.custom_translation[key] = {"translated":list[nr][elem].translated}
				/**/console.log(body.custom_translation);
			}
		})
		fetch(location.origin+"/admin/custom_translations.json",
		{
			"headers": {
			"accept": "application/json, text/plain, */*",
			"content-type": "application/json;charset=UTF-8",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-csrf-token": token
			},
			"body": JSON.stringify(body),
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
		});
	}
	currentnr++;
};
setInterval(() => {
	if (currentnr<list.length){
		create_translation(currentnr);
	}
}, 1000);