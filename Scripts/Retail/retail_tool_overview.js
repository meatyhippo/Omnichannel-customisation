//gets called from a from github bookmark, shows all the tools
!function(){
	(()=>{
		if (document.getElementById('modules')){console.log('modules already loaded');}else{
			let modules = `
			// ------------------- module functions
			// function for nice logging
			function fancy_log(messages,style) {
				let background = "background: #555; padding: 2px; margin:2px; border-radius:2px;";
				let log = '';
				style.forEach((styl,i) => {
					style[i] = style[i] || background+"color:white;";
					switch (style[i]) {
						case "success":
							style[i] = background+"color:#bada55;";
							break;
						case "info":
							style[i] = "color:DodgerBlue;";
							break;
						case "error":
							style[i] = background+"color:Red;";
							break;
						case "warning":
							style[i] = background+"color:Orange;";
							break;
						case "blue":
							style[i] = background+"color:darkblue;"
						default:
							style[i] = style[i];
					}
					if(messages[i])log+=messages[i];
				})
				console.log(log, style[0], style[1]?style[1]:'', style[2]?style[2]:'', style[3]?style[3]:'');
			}
			// retail UI notification
			function retail_UI_notification(start_time){
				let end_time = Date.now(),
				seconds = (end_time-start_time)/1000;
				console.groupCollapsed('%cClick me to open status report','color:#bada55;background: #555; padding: 2px; margin:2px; border-radius:2px;');
				/**/fancy_log(['%cSucceeded: '+Object.keys(success_list).length, '%o'],['info',success_list]);
				if(fail_list.length>0)fancy_log(['%cFailed: '+fail_list.length, '%o'],['error', fail_list]);
				/**/fancy_log(['%cThis action has taken '+ seconds + ' seconds / ' + (seconds/60) + 'minutes'],['info']);
				console.groupEnd();
				if(continuing){
					$('#successNotificationMessage').html('All done! </br>'+
						'Action took: '+roundToTwo(seconds)+' seconds / '+roundToTwo((seconds/60))+' minutes</br>'+
						'Items failed: '+fail_list.length+'</br>'+
						'Items succeeded: '+Object.keys(success_list).length+'</br>'+
						'This page wil auto refresh in 45 secs');
					$('body').append('<style>#success{top:0;text-align:center}</style>');
				} else {
					$('#successNotificationMessage').html('Cancelled action! </br>'+
						'Ran for: '+roundToTwo(seconds)+' seconds / '+roundToTwo((seconds/60))+' minutes</br>'+
						'Items failed: '+fail_list.length+'</br>'+
						'Items succeeded: '+Object.keys(success_list).length+'</br>'+
						'This page wil auto refresh in 45 secs');
					$('body').append('<style>#success{top:0;text-align:center}#success::before{background:#a44039;}</style>');
				}
				window.setTimeout(() => {
					location.reload();
				}, 60 * 1000);		
			}
			// round to 2 decimal
			function roundToTwo(num) {    
				return +(Math.round(num + "e+2")  + "e-2");
			}
			// cancel actions
			window.setTimeout(() => {
				$(document).keydown(function(e){
					if (e.altKey){
						/**/console.log('alt pressed');
						continuing = false;
						/**/console.log(continuing);
					}
				});
			}, 500); `;
			let script_ = document.createElement('script');
			script_.id = 'modules',
			script_.innerHTML = modules;
			document.body.appendChild(script_);
			console.log('modules loaded');}
	})();
	function append(link){
		console.log("starting...");
		//append script to page
		let script_ = document.createElement('script');
		script_.setAttribute('async',''),
		script_.src = `https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${version}/Scripts/Retail/${link}`;
		document.body.appendChild(script_);
	};
	let tools = [
		{
			link:'Export_runner.js',
			name:'Export tool',
			description: 'Runs the retail export tool'
		},
		{
			link:'Tools/retail_json_page.js',
			name:'Open in JSON',
			description: 'Opens the current page in JSON'
		},
		{
			link:'Tools/search_ecom_order.js',
			name:'Ecom order search',
			description: 'Copy order id in eCom url to check in reports'
		},
		{
			link:'Tools/all_matrix_variants.js',
			name:'Click all variants',
			description: 'Use in matrix configiguration tab'
		},
		{
			link:'Tools/delete_all_images.js',
			name:'Delete all images',
			description: 'Deletes all item images from retail'
		},
		{
			link:'Tools/customerID_to_pagerfield.js',
			name:'Customer ID to pagerfield',
			description: 'Replaces the customer pager with customer internal id'
		},
		{
			link:'Tools/county_to_tag.js',
			name:'Customer country code added to tags',
			description: 'Add a tag to a customer file with the customer\'s country code as ISO code(2 letter)'
		},
		{
			link:'Tools/split_matrix.js',
			name:'Split up Color/Size matrix',
			description: 'Splits up into multiple color matrices (be in the matrix to split)'
		},
		{
			link:'Tools/retrieve_payment_ids.js',
			name:'Retrieve payment ID\'s',
			description: 'Get the archived payment ID\'s from sale id\'s ()'//TODO #8 add izettle jira
		}
	];
	wrapper=document.createElement('div'),
	wrapper.id = 'tool_wrapper',
	wrapper.onclick = function(){
		document.body.removeChild(wrapper),
		document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]').forEach(link =>{
			document.body.removeChild(link);
		});
		document.querySelectorAll('link[href^="https://cdn.jsdelivr.net/gh/meatyhippo/"]').forEach(link =>{
			document.head.removeChild(link);
		});
	},
	box = document.createElement('div'),
	box.id = 'tool_box',
	v_box = document.createElement('div'),
	v_box.id = 'version',
	v_box.innerHTML='<p>'+version+'</br>what\'s new: split matrix into separat matrices</p>',
	close = document.createElement('div'),
	close.id = 'close',
	close.onclick=function(){
		document.body.removeChild(wrapper),
		document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]').forEach(link =>{
			document.body.removeChild(link);
		});
		document.querySelectorAll('link[href^="https://cdn.jsdelivr.net/gh/meatyhippo/"]').forEach(link =>{
			document.head.removeChild(link);
		});
	},
	table = document.createElement('table'),
	table.id = 'table',
	tbody=document.createElement('tbody'),
	tr = document.createElement('tr');
	tr.innerHTML = '<td style="transform:translate(50%,0);font-size:2em;">Welcome to retail tools</td>';
	tbody.append(tr);
	tools.forEach((item,i) => {
		tr = document.createElement('tr');
		td = document.createElement('td');
		a = document.createElement('a');
		a.onclick = function(){let link = item.link;append(link)};
		a.innerHTML = item.name;
		td.appendChild(a);
		tr.appendChild(td);
		td = document.createElement('td');
		td.appendChild(document.createTextNode(' : '+item.description));
		tr.appendChild(td);
		tbody.appendChild(tr);
	})
	console.log(tools);
	table.appendChild(tbody),
	box.appendChild(table),
	box.appendChild(v_box),
	box.appendChild(close),
	wrapper.appendChild(box),
	document.body.appendChild(wrapper)
}();