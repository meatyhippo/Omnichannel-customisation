//beta_backoffice
!function(){
	//declaring global variables
	let shop = window.SEOshop.react.shop;
	window.shop_info = {
		sub_info:[
			'End date;'+shop.subscription.end_date,
			'Has B2B;'+shop.subscription.has_b2b,
			'Blogs;'+shop.subscription.has_blogs,
            'Content templates;'+shop.subscription.has_content_editor,
            'Discount rules;'+shop.subscription.has_discount_rules,
        	shop.multishop_id>0?'Multishop;'+shop.multishop_id+' ('+shop.multishop_sync_by+' sync)':'',
            'Product bundles;'+shop.subscription.has_product_bundles,
            'Product discounts;'+shop.subscription.has_product_discounts,
            //'has_template_editor':true,
            'Max products;'+shop.subscription.max_products,
        	shop.subscription.max_user_accounts>0?'Max users;'+shop.subscription.max_user_accounts:'Max users;no limit',
			'Max languages;'+shop.subscription.max_languages,
			'Monthly fee;'+shop.subscription.monthly_fee_amount,
            'Last provisioning (aka. billing push);'+shop.subscription.provisioned_at
		],
		clusterlist:{
			1:'Netherlands',
			14:'German',
			15:'Spanish',
			19:'Russian',
			23:'Norwegian',
			28:'UK',
			38:'US',
			40:'CAN',
			42:'ROW',
			44:'REMEA',
			1000:'Lightspeed USA',
			1001:'Lightspeed Canada',
			1002:'Lightspeed Rest of World',
			1003:'Lightspeed Australia',
		},
		name: shop.company_name,
		domain: shop.shop_url,
		shop_id: shop.id,
		rad_id: shop.retail_id,
		shopowner:'',
	};
	let url_calls = [
		location.origin+location.pathname+'.json',
		shop.admin_url+'shop_users.json',
		shop.admin_url+'themes.json',
		shop.admin_url+'themes/'+shop.current_theme_id+'.json',
		shop.admin_url+'store/purchases/apps.json',
	];
	let quickLinks = [
		'/orders;'+'/customers',
		'/products;'+'/categories',
		'/pages;'+'/custom_translations',
		'/settings;'+'/settings/advanced',
		'/shipping_methods;'+'/settings/workflow',
		'/notifications;'+'/settings/web_extras',
		'/payment_providers;'+'/taxes',
		'/store/purchases/apps'
	];
	let quicktools = {
		links:[
			'?limit=250',
			'?with_context=1'
		],
		tools:[
			'/Scripts/eCom/eCom_cat_product_export.js',
			'/Scripts/eCom/product_full_category_path.js',
			'/Scripts/eCom/Customer_data_export.js'
		]
	};
	for (const key in shop_info.clusterlist) {
		if (key == shop.reseller_id) {
			shop_info.cluster = shop_info.clusterlist[key];
		}
	};
	url_calls.forEach((url,index) => {
		$.getJSON(url,
			function (x, textStatus, jqXHR) {
				shop_info[Object.keys(x)[0]] = x;
			}
		);
	});
	function appendScript_(tool){
		let script = document.createElement('script');script.src = `https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${version}${tool}`;document.body.appendChild(script);document.body.removeChild(div_wrap);
	};
//call rest of render after loading variables
	$(document).ajaxStop(()=>{
		/**/console.log('loading done');
		$(document).off('ajaxStop'); // remove ajaxstop to avoid double download
		function o(e,o,l,n){
			if(row = document.createElement('tr'),col = document.createElement('td'),col.appendChild(document.createTextNode(`${e}:`)),row.appendChild(col),l)
			switch(l){					
				case 'IDs':
					col = document.createElement('td'),
					//v2
					p = document.createTextNode(o),
					col.appendChild(p);
					//rad_id
					if(shop_info.rad_id>0){
						col.appendChild(document.createTextNode(' // ')),
						a = document.createElement('a'),
						a.appendChild(document.createTextNode(shop_info.rad_id)),
						a.target='_blank';
						a.href=`https://shop.merchantos.com/?name=system.views.account&form_name=view&id=${shop_info.rad_id}&tab=details`
						col.appendChild(a);
					}
					//user
					shop_info.shop_users.shop_users.forEach(user => {
						if(user.is_shop_owner){
							shop_info.shopowner = user.user.email;
						}
					});
					col.appendChild(document.createTextNode(' // ')),
					a = document.createElement('a'),
					a.appendChild(document.createTextNode(shop_info.shopowner)),
					a.target='_blank',
					a.href=location.origin+'/admin/shop_users',
					col.appendChild(a);
				break;
				case 'cluster':
					col = document.createElement('td'),
					//v1
					a = document.createElement('a'),
					a.appendChild(document.createTextNode(o)),
					a.target='_blank';
					if (location.host.includes('webshopapp')){
						a.href=`https://seoshop.webshopapp.com/backoffice/core/setshop.do?id=${shop_info.shop_id}`
					} else if (location.host.includes('shoplightspeed')) {
						a.href=`https://store.shoplightspeed.com/backoffice/core/setshop.do?id=${shop_info.shop_id}`
					}
					col.appendChild(a);
					col.appendChild(document.createTextNode(` // ${shop_info.cluster}`));
					col.appendChild(document.createTextNode(` // ${shop.status.toUpperCase()}`));
					a = document.createElement("a"),
					a.classList.add('hide'),
					a.id = 'show_this',
					a.appendChild(document.createTextNode(" / Staff")),
					a.target="_blank";
					a.href=`https://staff.${location.hostname.split('.')[1]}.com/shops/${shop_info.shop_id}`;
					col.appendChild(a);
				break;
				case 'themes':
					let theme_links=[
						'search;'+'/Scripts/eCom/theme_search.js;'+'1',
						'settings;'+`${location.origin}/admin/theme/preview;`+'0',
						o?'editor;'+`${location.origin}/admin/${l}/${shop.current_theme_id}`+';0':'',
						'custom css;'+`${location.origin}/admin/themes/${shop.current_theme_id}/editor/css`+';0',
						o?'twig search;'+'/Scripts/eCom/twig_search.js;'+'1':'',
					]
					col = document.createElement('td');
					theme_links.forEach((link,i) => {
						a = document.createElement('a'),
						a.target='_blank',
						a.appendChild(document.createTextNode(link.split(';')[0]));
						link.split(';')[2]!=1?a.href=link.split(';')[1]
						:a.onclick=function(){
							console.log('started search');
							appendScript_(link.split(';')[1]);
						},
						col.appendChild(a);
						link==''?'':i!=(theme_links.length-1)?col.appendChild(document.createTextNode(' // ')):'';
					});
					break;
				case 'language':
					//name column
					col = document.createElement('td');
					let BO_langs = {
						//ES: 5, 
						NL: 1,
						EN: 3,
						FR: 4,
						DE: 2
					};
					let iterator = 0;
					for (const lang in BO_langs) {
						iterator++
						a = document.createElement('a'),
						a.onclick = function(){
							jQuery.post( '/admin/account/edit', '_method=patch&utf8=%25E2%259C%2593&user[language_id]='+BO_langs[lang],function(data){
								Turbolinks.visit(location);
								console.log('switching to '+lang);
							})
						},
						a.appendChild(document.createTextNode(lang)),
						col.appendChild(a);
						iterator!=(Object.keys(BO_langs).length)?col.appendChild(document.createTextNode(' // ')):'';
					};
				break;
				case 'quickies':
					col = document.createElement('td'),
					a = document.createElement('a'),
					a.appendChild(document.createTextNode(' ')),
					a.classList.add('arrow_down'),
					a.onclick = function(){
						$('#links').toggleClass('hide');
						$(this).toggleClass('arrow_right arrow_down');
					},
					col.appendChild(a),
					div = document.createElement('div'),
					div.id = 'links',
					tables = document.createElement('table'),
					quickLinks.forEach(link => {
						tr = document.createElement('tr');
						link.split(';').forEach((setting) => {
							td = document.createElement('td'),
							a = document.createElement('a'),
							a.href=location.origin+'/admin'+setting,
							a.target='_blank',
							a.appendChild(document.createTextNode(setting)),
							td.appendChild(a),
							tr.appendChild(td);
						});
						tables.appendChild(tr);
					});
					div.appendChild(tables);
					col.appendChild(div);
				break;
				case 'APPS':
					col = document.createElement('td'),
					a = document.createElement('a'),
					a.appendChild(document.createTextNode(' ')),
					a.classList.add('arrow_right'),
					a.onclick = function(){
						$('#APPS').toggleClass('hide');
						$(this).toggleClass('arrow_down');
					},
					col.appendChild(a),
					div = document.createElement('div'),
					div.id = 'APPS',
					div.classList.add('hide');
					ol = document.createElement('ol'),
					shop_info.shop_store_items.shop_store_items.forEach(app => {
						if (!app.is_cancelled){
							li = document.createElement('li');
							a = document.createElement('a');
							a.href= location.origin+'/admin/store/apps/'+app.store_item_id,a.target='_blank';
							a.appendChild(document.createTextNode(app.title));
							li.appendChild(a);
							ol.appendChild(li);
						}
					});
					div.appendChild(ol);
					col.appendChild(div);
				break;
				case 'TTV':
					col = document.createElement('td'),
					a = document.createElement('a'),
					a.appendChild(document.createTextNode(o)),
					a.onclick = function(){
						$('#TTV').toggleClass('hide');
						$(this).toggleClass('arrow_down');
							(()=>{
								//append overview to page
								let script = document.createElement('script');
								script.setAttribute('async',''),
								script.src = `https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${version}/Scripts/eCom/time_to_value.js`;
								document.body.appendChild(script);
								document.body.removeChild(div_wrap),
								document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]').forEach(link =>{
									document.body.removeChild(link);
								});
								document.querySelectorAll('link[href^="https://cdn.jsdelivr.net/gh/meatyhippo/"]').forEach(link =>{
									document.head.removeChild(link);
								});
							})();
					},
					col.appendChild(a);
				break;
				case 'SUB':
					col = document.createElement('td'),
					a = document.createElement('a'),
					a.appendChild(document.createTextNode(' ')),
					a.classList.add('arrow_right'),
					a.onclick = function(){
						$('#SUB').toggleClass('hide');
						$(this).toggleClass('arrow_down');
					},
					col.appendChild(a),
					div = document.createElement('div'),
					div.id = 'SUB',
					div.classList.add('hide');
					tables = document.createElement('table'),
					shop_info.sub_info.forEach(info => {
						tr = document.createElement('tr');
						info.split(';').forEach((item) => {
							td = document.createElement('td');
							td.appendChild(document.createTextNode(item));
							tr.appendChild(td)
						});
						tables.appendChild(tr);
					});
					div.appendChild(tables);
					col.appendChild(div);
				break;
				case 'tools':
					col = document.createElement('td'),
					a = document.createElement('a'),
					a.appendChild(document.createTextNode(' ')),
					a.classList.add('arrow_right'),
					a.onclick= function(){
						$('#TOOL').toggleClass('hide');
						$(this).toggleClass('arrow_down');
					},
					col.appendChild(a),
					div = document.createElement('div'),
					div.id = 'TOOL',
					div.classList.add('hide');
					quicktools.links.forEach(link=>{
						tr=document.createElement('tr');
						a=document.createElement('a');
						a.href=location.href+link;
						a.appendChild(document.createTextNode(link));
						tr.appendChild(a);
						div.appendChild(tr);
					});
					quicktools.tools.forEach(tool=>{
						tr=document.createElement('tr');
						a=document.createElement('a');
						a.onclick=function(){
							console.log('running '+tool.split("/")[(tool.split("/").length)-1]);
							appendScript_(tool);
						};
						a.appendChild(document.createTextNode(tool.split("/")[(tool.split("/").length)-1]));
						tr.appendChild(a);
						div.appendChild(tr);
					});
					col.appendChild(div);
				break;
				default:
					col = document.createElement('td'),
					a = document.createElement('a'),
					a.appendChild(document.createTextNode(o)),
					a.target='_blank',
					a.href= n ? l : `${location.origin}/admin/${l}`,
					col.appendChild(a)
				} else col = document.createElement('td'),
				col.appendChild(document.createTextNode(o));
				row.appendChild(col),
				tbody.appendChild(row)
			};
			div_wrap=document.createElement('div'),
			div_wrap.id = 'tool_wrapper',
			div_wrap.onclick = function(){
				document.body.removeChild(div_wrap),
				document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]').forEach(link =>{
					document.body.removeChild(link);
				});
				document.querySelectorAll('link[href^="https://cdn.jsdelivr.net/gh/meatyhippo/"]').forEach(link =>{
					document.head.removeChild(link);
				});
			},
			div_box = document.createElement('div'),
			div_box.id = 'tool_box',
			div_box.onclick = function(e){
				e.stopPropagation()
			},
			v_box = document.createElement('div'),
			v_box.id = 'version',
			v_box.innerHTML='<p>'+version+'</br>what\'s new: theme search, subscription info, RETAIL ID!</p>',
			close = document.createElement('div'),
			close.id = 'close',
			close.onclick=function(){
				document.body.removeChild(div_wrap),
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
			//function o(e,o,l,n)
			// e = text in first column
			// o = text in second column
			// l = used in the cases in the switch above, also the link
			// n = boolean in the default of the switch
			o(`Shop id // ${shop_info.rad_id>0?'rad_id // ':''}primary user`,shop_info.shop_id,'IDs');
			o('V1 // Shop cluster // Shop status','V1','cluster');
			o('Theme buttons',shop_info.theme,'themes');
			if(shop_info.themes.themes[0].en) {
				o('Name // Developer // Price',(shop_info.themes.themes[0].en.title)+' // '+(shop_info.themes.themes[0].designer.length>0?shop_info.themes.themes[0].designer:'custom')+' // '+'€'+(shop_info.themes.themes[0].prices>0?shop_info.themes.themes[0].prices[1].price:'0'),'store/themes?query='+shop_info.themes.themes[0].en.title);
			} else if (shop_info.themes.themes[0].nl){
				o('Name // Developer // Price',(shop_info.themes.themes[0].nl.title)+' // '+(shop_info.themes.themes[0].designer.length>0?shop_info.themes.themes[0].designer:'custom')+' // '+'€'+(shop_info.themes.themes[0].prices>0?shop_info.themes.themes[0].prices[1].price:'0'),'store/themes?query='+shop_info.themes.themes[0].nl.title);
			};
			o('Change BO lang.','NL','language');
			o('JSON','Open page JSON',location.origin+location.pathname+'.json'/*+location.search.replace(/^\?{1}/g,'&')*/,!0);
			if(location.pathname.match(/\/orders\/\d+/gm) && shop_info.order.order.payment_state =='not_paid'){
				o('Pay link','Generate Pay link',shop_info.domain+'payment/pay/'+shop_info.order.order.id,1)
			}
			o('Quick links','show','quickies');
			o('Installed apps','show','APPS');
			o('Time to value (for PS)','Click here','TTV');
			o('Subscription info','show','SUB');
			o('Extra tools','show','tools');
			console.log(shop_info);
			table.appendChild(tbody),
			div_box.appendChild(table),
			div_box.appendChild(v_box),
			div_box.appendChild(close),
			div_wrap.appendChild(div_box),
			document.body.appendChild(div_wrap)
		});
}();