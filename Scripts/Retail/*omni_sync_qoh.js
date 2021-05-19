// ------------------- working
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