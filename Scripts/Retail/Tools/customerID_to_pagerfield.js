function pagers(){
	//------------------- start declarions
	window.alert('This script will copy customer id\'s into the pagerfield.\nYou can enter a starting id and/or and ending id.\nThere will be a small report after completion. Progression will be logged into the browser console (CMD+shift+J).\n\nPlease stay on this page while running & refresh after completion.')
	window.success_list = {};
	window.fail_list = [];
	const	host = window.origin,
			rad_id = document.querySelector('#help_account_id > var').innerHTML,
			base_url = `${host}/API/Account/${rad_id}/Customer/`,
			attr = '@attributes';
	let start_id = parseInt(window.prompt('Want to start at a customer ID?',''),10)||0,
		end_id = parseInt(window.prompt('Want to end at a customer ID?',''),10)||999999999999,
		start_time = Date.now(),
		count = 0,
		continuing = true,
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
		$.getJSON(base_url+`.json?limit=1&customerID=><,${start_id},${end_id}`,(data, textStatus, jqXHR) => {
			totalcount = parseInt(data[attr].count,10);
		}).done((data, stat, jqXHR)=>{
			//console.log(totalcount, start_id, end_id, data, jqXHR);
			/**/console.log(`got ${totalcount} items, starting at ${start_id}`);
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
						count++
						body.Contact.Phones.ContactPhone.number = customer.customerID;
						settings.async = customer.customerID % 2==0||customer.customerID % 3==0?true:false;
						settings.data = JSON.stringify(body);
						$.ajax(`${base_url}${customer.customerID}.json?load_relations=[%22Contact%22]`,settings);
						if(count%10==0)/**/console.log(`done: ${(count-10)}-${count}/${totalcount}`);
					});
				}
			})
		}
	}
	// ------------------- module functions
	// UI notification
	$(document).ajaxStop(function() {
		let end_time = Date.now(),
		seconds = (end_time-start_time)/1000;
		/**/console.log('Items succeeded: '+Object.keys(success_list).length, success_list);
		/**/console.log('items failed: '+fail_list.length, fail_list);
		/**/console.log('This action has taken ' + seconds + ' seconds / ' + (seconds/60) + 'minutes');
		if(continuing){
			$('#successNotificationMessage').html(`All done! </br>
				Action took: ${roundToTwo(seconds)} seconds / ${roundToTwo((seconds/60))} minutes</br>
				Items failed: ${fail_list.length}</br>
				Items succeeded: ${Object.keys(success_list).length}`);
			$('body').append('<style>#success{top:0;text-align:center}</style>');
		} else {
			$('#successNotificationMessage').html(`Cancelled action! </br>
				Ran for: ${roundToTwo(seconds)} seconds / ${roundToTwo((seconds/60))} minutes</br>
				Items failed: ${fail_list.length}</br>
				Items succeeded: ${Object.keys(success_list).length}`);
			$('body').append('<style>#success{top:0;text-align:center}#success::before{background:#a44039;}</style>');
		}
	});
	// round to 2 decimal
	function roundToTwo(num) {    
		return +(Math.round(num + "e+2")  + "e-2");
	}
	// cancel actions
	window.setTimeout(() => {
		$(document).keydown(function(e){
			if (e.altKey){
				/**/console.log(e.altKey);
				continuing = false;
			}
		});
	}, 500);
}pagers();