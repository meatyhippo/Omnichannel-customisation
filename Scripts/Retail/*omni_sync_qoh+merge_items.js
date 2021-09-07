// ------------------- working qoh sync
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


// ------------------- working merge items
(()=>{
	let merge_into = 1454;
	//let list = [];
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

// ------------------- delete menu button
let list = [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
list.forEach((id) => {
	$.get(`https://us.merchantos.com/ajax_forms.php?ajax=1&no_cache=1629881607630&form_name=listing.dofunction&ajax_listing={"draw_all":false,"draw_tab_only":false,"name":"menu.listings.menu_buttons","is_child_list":"1","saved_search":{"menu_id":"1","menu_type":"sale"},"sort":null,"sort_dir":"ASC","count":6,"page":1,"page_count":1,"tab":"single","display_search":true,"display_advanced":false,"page_size":15,"max_size":100,"page_controls":true,"title":"Buttons","deleted_rows":null,"row_num":5,"rec_num":6}&fnc=delete_record&key_values={"menu_id":"1","menu_type":"sale"}&row={"menu_button_id":${id},"can_edit":0,"is_submenu":1,"is_category_submenu":0,"title":"zehg,n","get_type_name":${id},"submenu_uid":0,"menu_id":0,"category_id":0,"button_type":"submenu","html_color":"","sort_order":301}&selected_records=[]&pannel_id=menu_listings_menu_buttons_view`,
	function (data, textStatus, jqXHR) {
/**/console.log(data);
	},
	"JSON"
);
})