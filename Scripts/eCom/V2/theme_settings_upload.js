(()=>{
	//copy from /admin/theme/manage/settings.json
	let settings = [],
//get auth token
	token = document.head.querySelectorAll('meta[name="csrf-token"]')[0].getAttribute('content'),
	orderlist=[];
//per setting in body, POST setting
	settings.forEach((setting,i) => {
		//post setting with simple body. will return a setting id in order to update
		let settingbody = {
			"theme_setting":{
				"title": setting.title,
				"type": setting.type
			}
		};
		$.ajax({
			type: "POST",
			url: location.origin + location.pathname + ".json",
			"headers": {
				"accept": "application/json, text/plain, */*",
				"content-type": "application/json",
				"x-csrf-token": token
			},
			data: JSON.stringify(settingbody),
			dataType: "json",
			async: false,
			success: function (res) {
				/**/console.log('setting used:', setting, res.theme_setting.id);
				update_setting(setting, res.theme_setting);  //get id from json and put into patch function
			},
			error: function (err, textStatus, jqXHR) {
				/**/console.log("error creating", err, textStatus, jqXHR);
			}
			
		});
	});	
	function update_setting(setting, theme_setting) {
		orderlist[setting.position]=theme_setting.id
		function options(options){
			let str = ``;
			for (const key in options) {
				if (Object.hasOwnProperty.call(options, key)) {
					const element = options[key];
					str += key + ':' + element + '\\n';
				}
			}
			/**/console.log(str);
			return str
		};
		$.ajax({
			type: "PATCH",
			url: location.origin + location.pathname + '/' + theme_setting.id + ".json",
			"headers": {
				"accept": "application/json, text/plain, */*",
				"content-type": "application/json",
				"x-csrf-token": token
			},
			dataType: "json",
			async: false,
			data: "{\"theme_setting\":{\"category\":\""+
			setting.category
			+"\",\"default_value\":\""+setting.default_value+
			"\",\"description\":\""+setting.description+
			"\",\"key\":\""+setting.key+
			"\",\"options\":\""+options(setting.options)+
			"\",\"position\":"+setting.position+
			",\"title\":\""+setting.title+
			"\",\"type\":\""+setting.type+
			"\",\"theme_setting_mapping\":{\"section\":\""+setting.theme_setting_mapping.section+
			"\",\"apply_to\":[\""+setting.theme_setting_mapping.apply_to[0]+"\"]}}}",
			success: function (result) {
				/**/console.log(result);
			},
			error: function (err) {
				/**/console.log("error updating:", err, err.responseJSON);
				/**/console.log('data:', data);
			}
		});
	}
	//end of creating settings
	/**/console.log('list:',orderlist);
	orderlist.shift();
	/**/console.log('list:',orderlist);
	fetch(location.origin + "/admin/theme/manage/settings/bulk.json", {
		"headers": {
			"accept": "application/json, text/plain, */*",
			"content-type": "application/json",
			"x-csrf-token": token
		},
	  	"body": "{\"ids\":["+orderlist+"],\"operation\":\"reorder\"}",
		"method": "PATCH",
		"mode": "cors",
		"credentials": "include"
	  });
	  
})();




// TODO #17 implement uploading theme code (/files, but dragging files is fine)

// TODO #18 copy full personal theme settings

// TODO #19 test multiple apply to pages