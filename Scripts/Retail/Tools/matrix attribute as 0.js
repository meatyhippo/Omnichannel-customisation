function loops(){
	let list = [348,8392,8395,8606];
	list.forEach((xy,i) => {
		let body = {
			"ItemAttributes": {
			  "attribute2": "0",
			  "itemAttributeSetID": "1",
			}
		},
			host = window.origin,
			rad_id = document.querySelector('#help_account_id > var').innerHTML,
			fullurl = `${host}/API/Account/${rad_id}/Item/${xy}.json?load_relations=["ItemAttributes","ItemAttributes.ItemAttributeSet"]`,
			settings = {
				method: "PUT",
				url: fullurl,
				async: false,
				data: JSON.stringify(body),
				success: (stat)=>{/**/console.log(i+ ' - ' +xy+ ' - attribute added',stat);},
				error: (stat)=>{/**/console.log('error',stat);},
				dataType: "json"
			};
			$.ajax(settings);
	});
};loops();