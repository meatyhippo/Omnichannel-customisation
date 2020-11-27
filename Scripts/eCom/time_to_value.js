!function(){
	let css = `
		#types{
			padding: 30px!important;
			position: absolute!important;
			top: 50%!important;
			left: 50%!important;
			transform: translate(-50%,-50%)!important;
			background-color: rgba(0,0,0,0.3)!important;
			color:#ffffff;
		}
		#wrapper{
			position: fixed!important;
			z-index: 99999999!important;
			background-color: rgba(0,0,0,0.6)!important;
			top: 0!important;
			bottom: 0!important;
			left: 0!important;
			right: 0!important;
			height: 100vh!important;
			display: block;
		}
		#table{
			font-size: 16px!important;
			border-collapse: separate!important;
			border-spacing: 0px 0.3em!important;
		}
		#table tbody {
			line-height: 20px!important;
		}`;
	let style = document.createElement('style');
	style.innerHTML = css;
	document.body.appendChild(style);
//paint function 
	function value(name,array){
		let status = '';
		let counter = 0;
		if (typeof array == 'object'){
			array.forEach((url,index) => {
				let x = new XMLHttpRequest();
				x.open('GET', SEOshop.react.shop.admin_url+url, false),
				x.onload = function(){
					if (x.status >= 200 && x.status < 400){
						counter++;
						y=JSON.parse(x.response);
						switch (name) {
							case 'Shipment_providers':
								if (url.includes('postnl') && y.postnl_settings.is_active) status+='PostNL, ';
								if (url.includes('bpost') && y.bpost_settings.is_active) status+='Bpost, ';
								if (url.includes('shipping_methods') && y.shipping_methods.length > 0 ) status+=`Manual shipping: ${y.shipping_methods.length}, `;
								if (counter == array.length) rows(status);
								break;
							case 'Payments_providers':
								if (y.payment_provider_shops.length >= 1){
									y.payment_provider_shops.forEach(pay=>{
										pay.is_active?status+=`${pay.payment_provider.title}, `:'';
									})
								} else {status+='no'};
								rows(status);
								break;
							case 'Added_products':
								y.products.length>0?status='yes':status='no';
								rows(status);
								break;
							case 'Added_categories':
								y.categories.length>0?status='yes':status='no';
								rows(status);
								break;
							case 'Product_images':
								if (y.products.length>0){
									let imgcounter = 0;
									y.products.forEach(product=>{
										if (product.image) imgcounter++
									});
									let percentage = (imgcounter/y.products.length)*100;
									status = `${percentage}% (${imgcounter}/${y.products.length})`;
								} else status = 'no';
								rows(status);
								break;
							case 'SEO_fields':
								break;
							case 'Headlines':
								y.headlines.length>0?status='yes':status='no';
								rows(status);
								break;
							case 'Reviews':
								y.reviews.length>0?status='yes':status='no';
								rows(status);
								break;
							case 'Theme':
								console.log(y);
								if (y.themes[0].en.title && y.themes[0].en.title.length>0){
									status = y.themes[0].en.title;
								} else if (y.themes[0].nl.title) status = y.themes[0].nl.title;
								rows(status);
								break;
							case 'Social_media':
								break;
							case 'Design_finished':
								break;
							default:
								break;
						};
					}
				},
				x.send();
			});
		} else if(typeof array == 'string'){
			status = array;
			rows(status);
		}
//start panting rows
		function rows(status){
			if (status.length == 0) status+='no';
			let tr=document.createElement('tr');
			td=document.createElement('td');
			td.appendChild(document.createTextNode(name));
			td.appendChild(document.createTextNode(': '));
			tr.appendChild(td);
			td=document.createElement('td');
			td.appendChild(document.createTextNode(status));
			tr.appendChild(td);
			table.appendChild(tr)		
		}
	}
// create box - wrapper with close
	div_wrap = document.createElement('div'),
	div_wrap.id = 'wrapper',
	div_wrap.onclick = function(){document.body.removeChild(div_wrap);};
	div = document.createElement('div'),
	div.onclick = function(evt){evt.stopPropagation();},
	div.id = 'types';
	//document.onkeyup = function(ev){ev=ev||window.event; if(ev.key == 27){document.body.removeChild(div_wrap);}};
	table = document.createElement('table'),
	table.id = 'table';
//data paint functions
//value(name,array)
	value('Connected_domain',SEOshop.react.shop.shop_url.includes('webshopapp')?'no':'yes'),
	value('Shipment_providers',['shipping_methods.json','shipment_providers/settings/postnl.json',
	'shipment_providers/settings/bpost.json']),
	value('Payments_providers',['payment_providers.json']),
	value('Added_products',['products.json']),
	value('Added_categories',['categories.json']),
	value('Product_images',['products.json']),
	//value('SEO_fields',['admin.json'])
	value('Headlines',['headlines.json'])
	value('Reviews',['reviews.json'])
	value('Theme',['themes.json'])
	//value('Social_media',['admin.json'])
	//value('Design_finished',['admin.json'])
// ------------------- append all to body
	div.appendChild(table),
	div_wrap.appendChild(div),
	document.body.appendChild(div_wrap);
}();