// ------------------- qoh sync
(()=>{
	let list = [];
	let count = list.length;
	window.success_list = [];
	window.fail_list = [];
	let host = location.host;
	list.forEach((item_ID,i) => {
		count--;
		let settings = {
			url: `https://${host}/ajax_forms.php?ajax=1&form_name=view.dofunction&ajax_view={"count":1139,"rec_num":2,"request":false,"tab":"details","name":"item.views.item","record_id":${item_ID}}&fnc=sync_omni_qoh_fnc&key_values={"view_id":"","primary_id":"${item_ID}"}&pannel_id=view`,
			async: false,
			success: function (data, textStatus, jqXHR) {
				/**/console.log(item_ID, textStatus,'items left: '+count, jqXHR);
				success_list.push(item_ID);
			},
			fail: function (data, textStatus, jqXHR) {
				/**/console.log(item_ID, textStatus, jqXHR);
				fail_list.push(item_ID);
			},
		}
		$.get(settings);
	})
})();
// ------------------- merge items
(()=>{
	let merge_into = 1454;
	let list = [];
	let count = list.length;
	window.success_list = [];
	window.fail_list = [];
	let host = location.host;
	list.forEach((item_ID) => {
		if(item_ID!=merge_into){
			count--;
			let settings = {
				url: `https://${host}/ajax_forms.php?ajax=1&form_name=listing.dofunction&ajax_listing={"draw_all":false,"draw_tab_only":false,"name":"item.listings.item_merge","is_child_list":"1","saved_search":{"merge_with_id":"${merge_into}"},"sort":"model_year","sort_dir":"DESC","count":1103,"page":12,"page_count":12,"tab":"single","display_search":true,"display_advanced":"1","page_size":"100","max_size":100,"page_controls":true,"title":"Local Items","deleted_rows":null,"row_num":-1,"rec_num":-1}&fnc=multi_merge_item_function&key_values={"merge_with_id":"${merge_into}"}&row=false&selected_records=["${item_ID}"]&pannel_id=item_listings_item_merge_view`,
				async: false,
				success: function (data, textStatus, jqXHR) {
					/**/console.log(item_ID, textStatus,`${count} items left to merge`, jqXHR);
					success_list.push(item_ID);
				},
				fail: function (data, textStatus, jqXHR) {
					/**/console.log(item_ID, textStatus, jqXHR);
					fail_list.push(item_ID);
				},
			}
			$.get(settings);
		}
	})
})();
// ------------------- get all archived
(()=>{
	window.list=[];
	for (let index = 0; index <= 1454; index+=100) {
		$.get("https://us.merchantos.com/API/Account/"+merchantos.account.id+"/Item.json?archived=true&offset="+index,
		function (data, textStatus, jqXHR) {
			data.Item.forEach((item,i) => {
				list.push(item.itemID)
			})
		},
		"JSON");
	}
})();
// ------------------- delete menu button
(()=>{
	let list = [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
	list.forEach((id) => {
		$.get(`https://us.merchantos.com/ajax_forms.php?ajax=1&no_cache=1629881607630&form_name=listing.dofunction&ajax_listing={"draw_all":false,"draw_tab_only":false,"name":"menu.listings.menu_buttons","is_child_list":"1","saved_search":{"menu_id":"1","menu_type":"sale"},"sort":null,"sort_dir":"ASC","count":6,"page":1,"page_count":1,"tab":"single","display_search":true,"display_advanced":false,"page_size":15,"max_size":100,"page_controls":true,"title":"Buttons","deleted_rows":null,"row_num":5,"rec_num":6}&fnc=delete_record&key_values={"menu_id":"1","menu_type":"sale"}&row={"menu_button_id":${id},"can_edit":0,"is_submenu":1,"is_category_submenu":0,"title":"zehg,n","get_type_name":${id},"submenu_uid":0,"menu_id":0,"category_id":0,"button_type":"submenu","html_color":"","sort_order":301}&selected_records=[]&pannel_id=menu_listings_menu_buttons_view`,
		function (data, textStatus, jqXHR) {
			/**/console.log(data);
		},"JSON");
	})
})();
// ------------------- add tag to matrix
(()=>{
	let list = [],
	data = {"Tags":{"tag": "Shopify"}};
	list.forEach(matrixID=>{
		$.ajax({
			type: "PUT",
			url: `https://us.merchantos.com/API/Account/162977/ItemMatrix/${matrixID}.json?load_relations=[%22TagRelations.Tag%22]`,
			data: JSON.stringify(data),
			dataType: "JSON",
			success: function (response) {
				/**/console.log("Matrix:", matrixID, response.ItemMatrix);
			}
		});
	})
})();
// ------------------- identify non-inventory with vendorID's and remove the vendorID's
(()=>{
	window.success_list = [];
	window.fail_list = [];
	let rad_id = window.merchantos.account.id,
		attr = "@attributes",
		base_url = `${window.origin}/API/Account/${rad_id}/`,
		donecount = count = 0,
		value = "delete";
	function get_100(offset){
		$.ajax({
			type: "GET",
			async: "false",
			url: `${base_url}Item.json?load_relations=[%22ItemVendorNums%22]&offset=${offset}&itemType=non_inventory&ItemVendorNums.itemVendorNumID=%3E,0`,
			dataType: "JSON",
			success: (data, textStatus, jqXHR)=>{
				/**/console.log('100 items:',data, textStatus, jqXHR);
				count = parseInt(data[attr].count,10);
				if (!data.Item || data.Item.length==undefined){
				} else {
					data.Item.forEach(Item => {
						delete_vendorid(Item);
					});
				}
				if (offset < count){
					offset+=100;
					get_100(offset);
				}
			}
		});
	}
	function delete_vendorid(Item){
		if (Item.ItemVendorNums.ItemVendorNum.length==undefined){
			$.get(`https://us.merchantos.com/ajax_forms.php?ajax=1&no_cache=1632831122056&form_name=listing.dofunction&ajax_listing={"draw_all":false,"draw_tab_only":false,"name":"item.listings.vendor_numbers","is_child_list":"1","display_search":"0","saved_search":{"item_id":"${Item.itemID}"},"sort":null,"sort_dir":"ASC","count":1,"page":1,"page_count":1,"tab":"single","display_advanced":false,"page_size":100,"max_size":100,"page_controls":false,"title":"Vendor Numbers/IDs","deleted_rows":null,"row_num":0,"rec_num":1}&fnc=delete_vendor_num&key_values={"item_id":"${Item.itemID}"}&row={"archived":0,"vendor_num_id":${Item.ItemVendorNums.ItemVendorNum.itemVendorNumID},"item_id":${Item.itemID},"vendor_num":"${value}"}&pannel_id=item_listings_vendor_nums_view`, (data, textStatus, jqXHR)=>{/**/console.log(textStatus, `vendor id ${Item.ItemVendorNums.ItemVendorNum.itemVendorNumID}`,data); success_list.push(Item.itemID)}, "JSON");
		} else {
			Item.ItemVendorNums.ItemVendorNum.forEach(vID => {
				$.get(`https://us.merchantos.com/ajax_forms.php?ajax=1&no_cache=1632831122056&form_name=listing.dofunction&ajax_listing={"draw_all":false,"draw_tab_only":false,"name":"item.listings.vendor_numbers","is_child_list":"1","display_search":"0","saved_search":{"item_id":"${Item.itemID}"},"sort":null,"sort_dir":"ASC","count":1,"page":1,"page_count":1,"tab":"single","display_advanced":false,"page_size":100,"max_size":100,"page_controls":false,"title":"Vendor Numbers/IDs","deleted_rows":null,"row_num":0,"rec_num":1}&fnc=delete_vendor_num&key_values={"item_id":"${Item.itemID}"}&row={"archived":0,"vendor_num_id":${vID.itemVendorNumID},"item_id":${Item.itemID},"vendor_num":"${value}"}&pannel_id=item_listings_vendor_nums_view`, (data, textStatus, jqXHR)=>{/**/console.log(textStatus, `vendor id ${vID.itemVendorNumID}`,data); success_list.push(Item.itemID)}, "JSON");
			});
		}
		/**/console.log(donecount+'/'+count);
		donecount++;
	}
	get_100(0);
})();
// ------------------- move all sales from one location to another
(()=>{
	window.success_list = [];
	window.fail_list = [];
	let rad_id = window.merchantos.account.id,
		attr = "@attributes",
		base_url = `${window.origin}/API/Account/${rad_id}/`,
		donecount = count = 0,
		value = {
			"registerID": "5",
			"shopID": "1"
		};
	function get_100(offset){
		$.ajax({
			type: "GET",
			async: "false",
			url: `${base_url}Sale.json?offset=${offset}&shopID=2`,
			dataType: "JSON",
			success: (data, textStatus, jqXHR)=>{
				/**/console.log('100 items:',data, textStatus, jqXHR);
				count = parseInt(data[attr].count,10);
				if (!data.Sale || data.Sale.length==undefined){
				} else {
					data.Sale.forEach(Sale => {
						move_location(Sale);
					});
				}
				if (offset < count){
					offset+=100;
					get_100(offset);
				}
			}
		});
	}
	function move_location(Sale){
		$.ajax({
			type: "PUT",
			async: "false",
			url: `${base_url}Sale/${Sale.saleID}.json`,
			data: JSON.stringify(value),
			dataType: "JSON",
			success: function (response) {
				/**/console.log(response);
			}
		});
		/**/console.log(donecount+'/'+count);
		donecount++;
	}
	get_100(0);
})();
// ------------------- void all from list
(()=>{
	let reason_for_void = '';
	let list = [];


	let count = list.length;
	window.success_list = [];
	window.fail_list = [];
	let host = location.host;
	console.groupCollapsed('%cClick me to open logging info','color:Dodgerblue;background: #fff; padding: 2px; margin:2px; border-radius:2px;');
	list.forEach((sale) => {
		count--;
		let settings = {
			url: `https://${host}/ajax_forms.php?ajax=1&form_name=view.dofunction&ajax_view={"count":277,"rec_num":1,"request":false,"tab":"void","name":"transaction.views.transaction","record_id":${sale}}&fnc=void_sale_fnc&key_values={"view_id":"","primary_id":"${sale}","add_customer_search":"","void_reason":"${reason_for_void}"}&pannel_id=view`,
			async: false,
			success: function (data, textStatus, jqXHR) {
				/**/console.log(sale, textStatus,`${count} items left to merge`, jqXHR);
				success_list.push(sale);
			},
			fail: function (data, textStatus, jqXHR) {
				/**/console.log(sale, textStatus, jqXHR);
				fail_list.push(sale);
			},
		}
		$.get(settings);
	})
	console.groupEnd();
})();