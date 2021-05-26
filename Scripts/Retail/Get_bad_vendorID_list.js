function loops(){
	window.bad_list = [];
	let list_to_skip = [3721,3722,3723,3724,3725,3726,3727,1,2,262,4175,2137,2138,2139,2140,2141,2142,2143,2144,2145,2146,2147,2148,2149,2150,2151,2152,2153,2154,2155,2156,2157,2158,2159,2160,2161,7330,7331,7332,7333,7334,7335,7336,7337,7338,7339,7340,7381,7382,7383,7384,7385,7386,7387,7388,7389,7390,7391,7392,7393,7394,7395,7396,7397,7398,7399,7400,7401,7402,7404,7405,7406,7407,7408,7409,7410,7411,3943,3944,1775,11911,11912,11913,11914,11915,11916,11917,12398,12535,12555,7807,7808,7815,7816,7817,7818,7819,7820,12153,12160,12161,12162],
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
								url: host+'/API/Account/'+rad_id+'/Item/'+item.itemID+'.json',
								async:false,
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