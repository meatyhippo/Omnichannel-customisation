let token = document.head.querySelectorAll('meta[name="csrf-token"]')[0].getAttribute('content'),
jsondata = {
	"custom_translations": [
	  {
		"created_at": "2022-06-22T15:28:30+02:00",
		"id": 733140,
		"key": "brooklyn-usp-3",
		"updated_at": "2022-06-22T15:28:30+02:00",
		"frontend_translation": null,
		"nl": {
		  "id": 1547165,
		  "language_id": 1,
		  "translated": "5 ondersteuningsniveaus"
		},
		"de": {
		  "id": 1547166,
		  "language_id": 2,
		  "translated": "5 Unterstützungsebenen"
		},
		"fr": {
		  "id": 1547167,
		  "language_id": 4,
		  "translated": "5 niveaux de soutien"
		},
		"es": {
		  "id": 1547168,
		  "language_id": 5,
		  "translated": "5 niveles de apoyo"
		},
		"it": {
		  "id": 1547169,
		  "language_id": 8,
		  "translated": "5 livelli di supporto"
		},
		"us": {
		  "id": 1547170,
		  "language_id": 18,
		  "translated": "5 support levels"
		}
	  },
	  {
		"created_at": "2022-06-22T15:27:50+02:00",
		"id": 733139,
		"key": "brooklyn-usp-2",
		"updated_at": "2022-06-22T15:27:50+02:00",
		"frontend_translation": null,
		"nl": {
		  "id": 1547159,
		  "language_id": 1,
		  "translated": "40-70 km actieradius"
		},
		"de": {
		  "id": 1547160,
		  "language_id": 2,
		  "translated": "40-70 km Reichweite"
		},
		"fr": {
		  "id": 1547161,
		  "language_id": 4,
		  "translated": "Portée de 40 à 70 km"
		},
		"es": {
		  "id": 1547162,
		  "language_id": 5,
		  "translated": "40-70 km de alcance"
		},
		"it": {
		  "id": 1547163,
		  "language_id": 8,
		  "translated": "40-70 km di raggio d'azione"
		},
		"us": {
		  "id": 1547164,
		  "language_id": 18,
		  "translated": "40-70 km range"
		}
	  }
	]
}, //raw json data from /custom_translations.json
list = jsondata.custom_translations,
totalnr = list.length;
currentnr = 0; // manually looping via interval in final lines. This avoids rate limits as well as a stack overflow from using synchronous functions
function create_translation(nr){
	if(list[nr].frontend_translation==null){
		let body = {
			"custom_translation":{
				"key": list[nr].key
			}
		};
		Object.keys(list[nr]).forEach(elem=>{
			if(list[nr][elem] != null && list[nr][elem].language_id){ // filter out the translations per language code
				let key = elem; //set body key to be language code
				body.custom_translation[key] = {"translated":list[nr][elem].translated} // translation per language in body
				/**/console.log('number:', (currentnr+1)+'/'+totalnr, body.custom_translation);
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
	} else {
		fetch(location.origin+"/admin/custom_translations/override.json", {
			"headers": {
				"accept": "application/json, text/plain, */*",
				"content-type": "application/json;charset=UTF-8",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"x-csrf-token": token
			},
			"body": "{\"custom_translation\":{\"translation_id\":733}}",
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
			});
		fetch("https://andys-theme-and-app-club.webshopapp.com/admin/custom_translations/736298.json", {
			"headers": {
				"accept": "application/json, text/plain, */*",
				"content-type": "application/json;charset=UTF-8",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"x-csrf-token": token
			},
			"referrer": "https://andys-theme-and-app-club.webshopapp.com/admin/custom_translations",
			"referrerPolicy": "strict-origin-when-cross-origin",
			"body": "{\"custom_translation\":{\"key\":\"$1 must be a numeric value.\",\"nl\":{\"translated\":\"zedcoiub\"},\"us\":{\"translated\":\"etfounrv\"}}}",
			"method": "PATCH",
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