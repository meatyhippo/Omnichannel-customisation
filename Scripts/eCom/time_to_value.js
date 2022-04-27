!function(){
	let css = `
		#types{padding: 30px!important;position: absolute!important;top: 50%!important;left: 50%!important;transform: translate(-50%,-50%)!important;background-color: rgba(0,0,0,0.3)!important;color:#ffffff;}
		#tool_wrapper{position: fixed!important;z-index: 99999999!important;background-color: rgba(0,0,0,0.6)!important;top: 0!important;bottom: 0!important;left: 0!important;right: 0!important;height: 100vh!important;display: block;}
		#table{font-size: 16px!important;border-collapse: separate!important;border-spacing: 0px 0.3em!important;}
		#table tbody {line-height: 20px!important;}
		#table tr td {min-width: 180px;}`;
	let style = document.createElement('style');
	style.innerHTML = css;
	document.body.appendChild(style);
//paint function 
	function value(name,array,tr_number){
		window.ttv = {};
		let status = '';
		let counter = 0;
		//start panting rows
		tr=document.createElement('tr');
		tr.id=tr_number;
		td=document.createElement('td');
		td.appendChild(document.createTextNode(name));
		tr.appendChild(td);
		table.appendChild(tr);
		if (typeof array == 'object'){
			array.forEach((url,index) => {
				let x = new XMLHttpRequest();
				x.open('GET', SEOshop.react.shop.admin_url+url, true),
				x.onload = function(){
					if (x.status >= 200 && x.status < 400){
						counter++;
						y=JSON.parse(x.response);
						ttv[Object.keys(y)[0]] = y;
						switch (name) {
							case 'Shipment providers:':
								if (url.includes('postnl') && y.postnl_settings.is_active) status+='PostNL + ';
								if (url.includes('bpost') && y.bpost_settings.is_active) status+='Bpost + ';
								if (url.includes('shipping_methods') && y.shipping_methods.length > 0 ) status+=`Manual shipping: ${y.shipping_methods.length} + `;
								if (counter == array.length){
									document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								};
								break;
							case 'Payments providers:':
								if (y.payment_provider_shops.length >= 1){
									y.payment_provider_shops.forEach(pay=>{
										pay.is_active?status+=`${pay.payment_provider.title} + `:'';
									})
								} else {status+='no'};
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'Added products:':
								y.products.length>0?status='yes':status='no';
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'Product images:':
								if (y.products.length>0){
									let imgcounter = 0;
									y.products.forEach(product=>{
										if (product.image) imgcounter++;
									});
									let percentage = Math.trunc((imgcounter/y.products.length)*100);
									status = `${percentage}% (${imgcounter}/${y.products.length})`;
								} else status = 'no';
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'Added categories:':
								y.categories.length>0?status='yes':status='no';
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'Headlines:':
								y.headlines.length>0?status='yes':status='no';
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'Reviews:':
								y.reviews.length>0?status='yes':status='no';
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'Theme:':
								if (y.themes[0].en.title && y.themes[0].en.title.length>0){
									status = y.themes[0].en.title;
								} else if (y.themes[0].nl.title) status = y.themes[0].nl.title;
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'Total revenue:':
								status = '€ '+y.statistics.financials.stats.total_revenue_incl+' (average order: €'+y.statistics.financials.stats.avg_order_value_incl+')';
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'Orders:':
								status = y.links.count;
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'Last login:':
								y.shop_users.forEach(user => {
									if(user.is_shop_owner&&user.user.last_login_at>0){
										status = user.user.last_login_at.match(/((.+)T)/gi);
									} else status = 'none';
								});
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'SEO_fields:':
								if (y.products.length>0){
									let metafields = 0;
									let enteredmeta = 0;
									y.products.forEach(product=>{;
										for (const key in product.metafields) {
											if (Object.hasOwnProperty.call(product.metafields, key)) {
												const element = product.metafields[key];
												metafields++;
												if (element.length>0) enteredmeta++;	
											}
										}
									});
									status = `${(enteredmeta/metafields)*100}% (${enteredmeta}/${metafields})`;
								} else status = 'no';
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
							case 'Google Analytics/GSC:':
								if (url.includes('web_statistics')){
									y.web_statistics.stats_google_analytics.tracking_id&&y.web_statistics.stats_google_analytics.tracking_id.length>1?status+=`${y.web_statistics.stats_google_analytics.tracking_id} // `:status+='nope // ';
								} else if (url.includes('web_extras')){
									/**/console.log(y);
									y.settings.google_search_console.meta_tags.length>0?status+=`${y.settings.google_search_console.meta_tags.length} tags`:status+='nope';
								}
								if (counter == array.length){
									document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								};
								break;
							default:
								document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${status}</td>`);
								break;
						};
					}
				},
				x.send();
			});
		} else if(typeof array == 'string'){
			document.getElementById(tr_number).insertAdjacentHTML('beforeend',`<td>${array}</td>`);
		}
	}
// create tool_box - tool_wrapper with close
	div_wrap = document.createElement('div'),
	div_wrap.id = 'tool_wrapper',
	div_wrap.onclick = function(){document.body.removeChild(div_wrap);};
	div = document.createElement('div'),
	div.onclick = function(evt){evt.stopPropagation();},
	div.id = 'types';
	//document.onkeyup = function(ev){ev=ev||window.event; if(ev.key == 27){document.body.removeChild(div_wrap);}};
	table = document.createElement('table'),
	table.id = 'table';
	// ------------------- append all to body
	div.appendChild(table),
	div_wrap.appendChild(div),
	document.body.appendChild(div_wrap);
//data paint functions
//value(name,array,tr_number)
	value('Last login:',['shop_users.json'],1),
	value('Connected domain:',SEOshop.react.shop.shop_url.includes('webshopapp')?'no':'yes',3),
	value('-------------------','',4),
	value('Orders:',['orders.json?limit=1'],5),
	value('Total revenue:',['statistics.json'],7),
	value('-------------------','',8),
	value('Added products:',['products.json'],9),
	value('Product images:',['products.json'],11),
	value('Added categories:',['categories.json'],13),
	value('Shipment providers:',['shipping_methods.json','shipment_providers/settings/postnl.json',
	'shipment_providers/settings/bpost.json'],15), 
	value('Payments providers:',['payment_providers.json'],17),
	value('-------------------','',18),
	value('Theme:',['themes.json'],19),
	value('Headlines:',['headlines.json'],21),
	//value('pages?');
	value('Reviews:',['reviews.json'],23),
	value('Google Analytics/GSC:',['web_statistics.json','settings/web_extras.json'],25);
	value('SEO_fields:',['products.json'],27);
}();