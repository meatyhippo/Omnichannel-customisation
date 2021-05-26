function delete_images(){
	//------------------- start declarions
	window.alert('WARNING. This will delete all images in the retail account. If you want to cancel, please close this tab.');
	window.success_list = {};
	window.fail_list = {};
	const	rad_id = document.querySelector('#help_account_id > var').innerHTML,
			base_url = `${window.origin}/API/Account/${rad_id}/Image/`,
			attr = '@attributes';
	let start_id = 0,
		count = 0,
		settings = {
		type: 'DELETE',
		async: '',
		data: '',
		dataType: 'json',
		success: function (response) {
			success_list[response.Image.imageID] = response.Customer;
		},
		error: function (response) {
			fail_list[response.Image.imageID] = response.Customer;
			/**/console.log('failed', response);
		}
		};
	(function(){
		$.getJSON(base_url+`.json?limit=1&orderby=imageID`,(data) => {
			start_id = parseInt(data.Image.imageID,10);
		})
		$.getJSON(base_url+`.json?limit=1&orderby=imageID&orderby_desc=1`,(data, stat, jqXHR) => {
			totalcount = parseInt(data[attr].count,10);
			end_id = parseInt(data.Image.imageID,10);
		}).done((data, stat, jqXHR)=>{
			console.log(totalcount, start_id, end_id, data, jqXHR);
			/**/console.log(`got ${totalcount} images, starting at ${start_id}`);
			loops();
		});
	})();
	//------------------- start looping through start - end number
	function loops(){
		//for loop increase start ID in query per 100
		for (start_id; start_id < end_id; start_id+=100) {
			$.getJSON(`${base_url}.json?imageID=><,${start_id},${end_id}`,
			(data, textStatus, jqXHR) => {
				/**/console.log('Images in this call: ',data,jqXHR);
					data.Image.forEach((Image)=>{
						count++;
						settings.async = (Image.imageID % 2==0||Image.imageID % 3==0)?true:false;
						$.ajax(`${base_url}${Image.imageID}.json`,settings);
						if(count%10==0)/**/console.log(`done: ${(count-10)}-${count}/${totalcount}`);
					});
			},'async:false')
		}
	}
	$(document).ajaxStop(function() {
		retail_UI_notification(start_time||0);
	});
}delete_images();