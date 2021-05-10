function loops(){
	window.bad_list = [];
	let list_to_skip = [109390,109391,109392,109393,109394,109395,67609,82485,76811,76812,77084,82548,77067],
		host = window.origin,
		rad_id = document.querySelector('#help_account_id > var').innerHTML,
		attr = '@attributes',
		calltimes;
	$.get(`${host}/API/Account/${rad_id}/Item.json?limit=2&load_relations=["ItemVendorNums"]&ItemVendorNums.itemVendorNumID=>,0`,
		function (data, textStatus, jqXHR) {
			/**/console.log(data);
			calltimes = data[attr].count;
		},
		"json"
	).done(function(){
		/**/console.log('got '+calltimes+' items');
		pushes();
	});
	function pushes(){
		/**/console.log('started ' + calltimes + ' items');
		for(let offset = 0; offset < calltimes; offset+=100 ){
			$.get(`${host}/API/Account/${rad_id}/Item.json?offset=${offset}&load_relations=["ItemVendorNums"]&ItemVendorNums.itemVendorNumID=>,0`,
				function (data, textStatus, jqXHR) {
					data.Item.forEach((item,i) => {
						if(!list_to_skip.includes(item.itemID)){
							settings = {
								method: "PUT",
								url: 'https://eu.merchantos.com/API/Account/135166/Item/'+item.itemID+'.json',
								async:false,
								data: '{"itemType": "default"}',
								success: ()=>{/**/console.log('Fine');},
								error: (jqXHR)=>{
									/**/console.log(jqXHR,jqXHR.responseJSON.message);
									if(jqXHR.responseJSON.message=='Item not updated. You can not set an ItemVendorNum without specifying a value.'){
										bad_list.push(item.itemID);
										/**/console.log(bad_list);
									}
								},
								dataType: "json"
							};
							try {
								$.ajax(settings);
							} catch (error) {
								console.log('failed',error);
							}
						}
					})
				},
				"json"
			)
		}
	}
};loops();