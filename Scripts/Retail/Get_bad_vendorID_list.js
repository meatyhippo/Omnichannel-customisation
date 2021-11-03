function loops(){
	window.bad_list = [];
	let list_to_skip = [],
		host = window.origin,
		rad_id = document.querySelector('#help_account_id > var').innerHTML,
		attr = '@attributes',
		count;
	$.get(`${host}/API/Account/${rad_id}/Item.json?limit=2&load_relations=["ItemVendorNums"]&ItemVendorNums.itemVendorNumID=>,0`,
		function (data, textStatus, jqXHR) {
			/**/console.log(data);
			count = data[attr].count;
		},
		"json"
	).done(function(){
		/**/console.log('got '+count+' total items');
		pushes();
	});
	function pushes(){
		/**/console.log('started ' + count + ' items');
		for(let offset = 0; offset < count; offset+=100 ){
			$.get(`${host}/API/Account/${rad_id}/Item.json?offset=${offset}&load_relations=["ItemVendorNums"]&ItemVendorNums.itemVendorNumID=>,0`,
				function (data, textStatus, jqXHR) {
					data.Item.forEach((item,i) => {
						if(!list_to_skip.includes(item.itemID)){
							settings = {
								method: "PUT",
								url: host+'/API/Account/'+rad_id+'/Item/'+item.itemID+'.json',
								async: false,
								data: '{"itemType": "default"}',
								success: ()=>{/**/console.log('Fine');},
								error: (jqXHR)=>{
									/**/console.log(jqXHR,jqXHR.responseJSON.message);
									if(jqXHR.responseJSON.message=='Item not updated. You can not set an ItemVendorNum without specifying a value.'|| jqXHR.responseJSON.message=='Item not updated. You can not have more than one ItemVendorNum for each vendorID'){
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