function pagers(){
	//------------------- start UI
	// ------------------- progress bar
	bar = document.createElement('div'),
	bar.setAttribute('style','margin:0;height:20px;background-color:lightpink;color:white;position: fixed;z-index: 9999999999999999;width:0.1%;'),
	bar.id = 'progressbar';
	document.body.prepend(bar);
	//------------------- start declarions
	window.alert('This script will copy customer id\'s into the pagerfield.\nYou can enter a starting id and/or and ending id.\nThere will be a small report after completion. Progression will be logged into the browser console (CMD+shift+J).\n\nPlease stay on this page while running & refresh after completion.')
	window.success_list = {};
	window.fail_list = [];
	window.continuing = true;
	let	rad_id = window.merchantos.account.id,
		base_url = `${window.origin}/API/Account/${rad_id}/Customer/`,
		attr = '@attributes',
		start_id = parseInt(window.prompt('Want to start at a customer ID?',''),10)||0,
		end_id = parseInt(window.prompt('Want to end at a customer ID? Or leave empty',''),10)||999999999999,
		start_time = Date.now(),
		count = donecount = 0,
		body = {
			"Contact": {
				"Phones": {
					"ContactPhone": {
						"number": 0,
						"useType": "Pager"
					}
				}
			}
		},
		settings = {
			type: 'PUT',
			async: '',
			data: '',
			dataType: 'json',
			success: function (response) {
				success_list[response.Customer.customerID] = response.Customer;
				//console.log('success:'+response.Customer.customerID, response.Customer.Contact.Phones.ContactPhone, response);
			},
			error: function (response) {
				fail_list.push(response);
				/**/console.log('failed', response);
			}
		};
	//------------------- start getting total amount of customers
	(function(){
		$.getJSON(base_url+`.json?limit=1&customerID=><,${start_id},${end_id}&orderby=customerID&orderby_desc=1`,(data, textStatus, jqXHR) => {
			count = parseInt(data[attr].count,10);
			if (end_id == 999999999999) end_id = parseInt(data.Customer.customerID,10);
		}).done((data, stat, jqXHR)=>{
			console.log(count, start_id, end_id, data, jqXHR);
			/**/console.log(`got ${count} items, starting at ${start_id}`);
			loops();
		});
	})();
	//------------------- start looping through start - end number
	function loops(){
		//for loop increase start ID in query per 100 
		for (start_id; start_id < end_id; start_id+=100) {
			$.getJSON(`${base_url}.json?customerID=><,${start_id},${end_id}`,
			(data, textStatus, jqXHR) => {
				/**/console.log('customers in this call: ',data,jqXHR);
				if(continuing){
					data.Customer.forEach((customer,i)=>{
						donecount++
						body.Contact.Phones.ContactPhone.number = customer.customerID;
						settings.async = (customer.customerID % 2==0||customer.customerID % 3==0)?true:false;
						settings.data = JSON.stringify(body);
						$.ajax(`${base_url}${customer.customerID}.json?load_relations=[%22Contact%22]`,settings);
						if(donecount%10==0)/**/console.log(`done: ${(donecount-10)}-${donecount}/${count}`);
					});
				}
			},'async:false')
		}
	}
	//------------------- progress bar load to do
	let openbar = window.setInterval(()=>{
		if ((donecount/count) >= 1) {
		} else {
			document.getElementById('progressbar').style.width = ((donecount/(count+1))*100) + '%';
		}
	}, 200);
	//------------------- at end
	$(document).ajaxStop(function() {
		retail_UI_notification(start_time);
	});
}pagers();