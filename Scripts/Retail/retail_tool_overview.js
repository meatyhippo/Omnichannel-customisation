//gets called from a from github bookmark, shows all the tools
!function(){
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
			link:'retail_json_page.js',
			name:'Open in JSON',
			description: 'Opens the current page in JSON'
		},
		{
			link:'search_ecom_order.js',
			name:'Ecom order search',
			description: 'Copy order id in eCom url to check in reports'
		},
		{
			link:'all_matrix_variants.js',
			name:'Click all variants',
			description: 'Use in matrix configiguration tab'
		}
	];
	wrapper=document.createElement('div'),
	wrapper.id = 'wrapper',
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
	box.id = 'box',
	//box.onclick = function(e){
	//	e.stopPropagation()
	//},
	v_box = document.createElement('div'),
	v_box.id = 'version',
	v_box.innerHTML='<p>'+version+'</br>what\'s new: theme search, subscription info, RETAIL ID!</p>',
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
	tr.appendChild(document.createTextNode('Welcome to the retail tools collection'));
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
		td.appendChild(document.createTextNode(item.description));
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