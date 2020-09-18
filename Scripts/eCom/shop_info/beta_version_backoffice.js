//beta_backoffice
//declaring global variables
!function(){
	let shop = window.SEOshop.react.shop;
	let clusterlist = {
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
	};
	let shop_info = {
		url_calls: [
			'/admin/shop_users.json',
			'/admin/themes.json',
		],
		sub_info: [
			'End date;'+shop.subscription.end_date,
			'Has B2B;'+shop.subscription.has_b2b,
			'Blogs;'+shop.subscription.has_blogs,
            'Content templates;'+shop.subscription.has_content_editor,
            'Discount rules;'+shop.subscription.has_discount_rules,
        	shop.multishop_id>0?'Multishop;'+shop.multishop_id+' ('+shop.multishop_sync_by+' sync)':"",
            'Product bundles;'+shop.subscription.has_product_bundles,
            'Product discounts;'+shop.subscription.has_product_discounts,
            //"has_template_editor":true,
            'Max products;'+shop.subscription.max_products,
        	shop.subscription.max_user_accounts>0?'Max users;'+shop.subscription.max_user_accounts:'Max users;no limit',
			'Max languages;'+shop.subscription.max_languages,
			'Monthly fee;'+shop.subscription.monthly_fee_amount,
			'Shop Status;'+shop.status,
            'Last provisioning (aka. billing push);'+shop.subscription.provisioned_at
		],
		name: shop.company_name,
		domain: shop.shop_url,
		shop_id: shop.id,
		rad_id: shop.retail_id,
		shopowner:'',
	};
	for (const key in clusterlist) {
		if (key == shop.reseller_id) {
			shop_info.cluster = clusterlist[key];
		}
	}
	shop_info.url_calls.forEach(url => {
		let x = new XMLHttpRequest();
		x.open("GET", location.origin+url, false),
		x.onload = function(){
			if (x.status >= 200 && x.status < 400){
				let y = JSON.parse( x.responseText );
				console.log(y);
				shop_info[Object.keys(y)[0]] = y;
				//call rest of render after loading variables
			} else if (x.status === 302) {
				let location = this.getResponseHeader("Location");
				console.log(location);
			}
		},
		x.send();
	});
	console.log(shop_info);
	backoffice_();
	function backoffice_(){
		let e = new XMLHttpRequest;
		e.open("GET",shop_info.domain+"?format=json",true),
		e.onload = function(){
			if(e.status>=200&&e.status<400){
				var t = JSON.parse(e.responseText);
				function o(e,o,l,n){
					if(row = document.createElement("tr"),col = document.createElement("td"),col.appendChild(document.createTextNode(`${e}:`)),row.appendChild(col),l)
					switch(l){					
						case "themes":
							col = document.createElement("td"),
							//design or editor
							a = document.createElement("a"),
							o ? (a.appendChild(document.createTextNode("editor")),a.href=`${location.origin}/admin/${l}/${t.shop.theme_id}`)
							:(a.appendChild(document.createTextNode("design")),a.href=`${location.origin}/admin/${l}/${t.shop.theme_id}/editor`),
							a.target="_blank",
							col.appendChild(a),
							//settings
							col.appendChild(document.createTextNode(", ")),
							a = document.createElement("a"),
							a.appendChild(document.createTextNode("settings")),
							a.target="_blank",
							a.href=`${location.origin}/admin/themes/${t.shop.theme_id}/editor`,
							col.appendChild(a),
							//customcss
							col.appendChild(document.createTextNode(", ")),
							a = document.createElement("a"),
							a.appendChild(document.createTextNode("custom css")),
							a.target="_blank",
							a.href=`${location.origin}/admin/themes/${t.shop.theme_id}/editor/css`,
							col.appendChild(a),
							//search
							col.appendChild(document.createTextNode(", ")),
							a = document.createElement("a"),
							a.appendChild(document.createTextNode("search")),
							a.onclick = function(){
								console.log("start search");
								//append script to page
								let script = document.createElement('script');
								script.setAttribute('async',''),
								script.src = `https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@v1.8.4/Scripts/eCom/theme_search.js`;
								document.body.appendChild(script);							
								document.body.removeChild(div_wrap);
							};
							col.appendChild(a);
							break;
						case "admin":
							//name column
							col = document.createElement("td"),
							//v2
							p = document.createTextNode(o),
							col.appendChild(p),
							//v1
							col.appendChild(document.createTextNode(", ")),
							a = document.createElement("a"),
							a.appendChild(document.createTextNode("V1")),
							a.target="_blank";
							if (location.host.includes('webshopapp')){
								a.href=`https://seoshop.webshopapp.com/backoffice/core/setshop.do?id=${o}`
							} else if (location.host.includes('shoplightspeed')) {
								a.href=`https://store.shoplightspeed.com/backoffice/admin-shops/edit?id=${o}`
							}
							col.appendChild(a);
							//user
							shop_info.shop_users.shop_users.forEach(user => {
								if(user.is_shop_owner){
									shop_info.shopowner = user.user.email;
								}
							});
							col.appendChild(document.createTextNode(", ")),
							a = document.createElement("a"),
							a.appendChild(document.createTextNode(shop_info.shopowner)),
							a.target="_blank",
							a.href=location.origin+'/admin/shop_users',
							col.appendChild(a);
						break;
						case "language":
							//name column
							col = document.createElement("td");
							let BO_langs = {
								//ES: 5, 
								NL: 1,
								EN: 3,
								FR: 4,
								DE: 2
							};
							for (const lang in BO_langs) {
									a = document.createElement("a"),
									a.href = '/';
									a.onclick = function(){
										jQuery.post( "/admin/account/edit", '_method=patch&utf8=%25E2%259C%2593&user[language_id]='+BO_langs[lang],function(data){
											Turbolinks.visit(location);
											console.log('switching to'+lang);
										})
									},
									a.appendChild(document.createTextNode(lang)),
									col.appendChild(a);
									col.appendChild(document.createTextNode(' // '))
							};
						break;
						case "SUB":
							col = document.createElement("td"),
							a = document.createElement("a"),
							a.appendChild(document.createTextNode(`${o} `)),
							a.id="hide_show",
							a.onclick = function(){
								$('#ips').toggleClass('hide');
								$('#hide_show').innerHTML="hide";
							},
							col.appendChild(a),
							div = document.createElement("div"),
							div.id = "ips",
							div.classList.add("hide");
							tables = document.createElement('table'),
							shop_info.sub_info.forEach(info => {
								tr = document.createElement('tr');
								info.split(';').forEach((item) => {
									td = document.createElement('td');
									td.appendChild(document.createTextNode(item));
									tr.appendChild(td)
								})
								//tr.innerHTML = '<td>'+info.split(';')[0]+': </td>'+'<td> '+info.split(';')[1]+'</td>';
								tables.appendChild(tr);
							});
							div.appendChild(tables);
							col.appendChild(div);
							break;
						default:
							col = document.createElement("td"),
							a = document.createElement("a"),
							a.appendChild(document.createTextNode(o)),
							a.target="_blank",
							a.href= n ? l : `${location.origin}/admin/${l}`,
							col.appendChild(a)
						} else col = document.createElement("td"),
						col.appendChild(document.createTextNode(o));
						row.appendChild(col),
						tbody.appendChild(row)
					};
					console.log(t),
					div_wrap=document.createElement("div"),
					div_wrap.id = "shop_id_wrapper",
					div_wrap.setAttribute('style','display: none;'),
					div_wrap.onclick = function(){
						document.body.removeChild(div_wrap),
						document.body.removeChild(document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]')[0]);
					},
					div_box = document.createElement("div"),
					div_box.id = "shop_id_box",
					div_box.onclick = function(e){
						e.stopPropagation()
					},
					v_box = document.createElement("div"),
					v_box.id = "shop_id_version",
					v_box.innerHTML="<p>v1</br>what's new: theme search, subscription info, BO language buttons</p>",
	
					close = document.createElement("div"),
					close.id = "shop_id_close",
					close.onclick=function(){
						document.body.removeChild(div_wrap),
						document.body.removeChild(document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]')[0])
					},
					table = document.createElement("table"),
					table.id = "shop_id_table",
					tbody=document.createElement("tbody"),
					//function o(e,o,l,n)
					// e = text in first column
					// o = result from json in function list below
					// l = used in the cases in the switch above, also the link
					// n = boolean in the default of the switch
					o("Shop Cluster",shop_info.cluster);
					o("Shop id // V1 // primary user",shop_info.shop_id,"admin");
					o("Theme info",t.shop.settings.template_editor,"themes");
					if(shop_info.themes.themes[0].en.title.length > 0) {
						o("Name // Developer // Price.",shop_info.themes.themes[0].en.title+' // '+shop_info.themes.themes[0].designer+' // '+shop_info.themes.themes[0].prices[1].price,'store/themes?query='+shop_info.themes.themes[0].en.title)
					};
					o("Languages // Currencies",`${Object.keys(t.shop.languages).length}: ${Object.keys(t.shop.languages).join(", ")} // ${Object.keys(t.shop.currencies).length}: ${Object.keys(t.shop.currencies).join(", ")}`,"settings/internationalization");
					o("Change BO lang.","NL","language")
					o("JSON","Open page JSON",location.origin+location.pathname+".json"/*+location.search.replace(/^\?{1}/g,"&")*/,!0);
					o("Api/app (js)scripts",Object.keys(t.shop.scripts).length||"None",Object.keys(t.shop.scripts).length&&"store/purchases/apps");
					o("Subscription info","show","SUB");
					table.appendChild(tbody),
					div_box.appendChild(table),
					div_box.appendChild(v_box),
					div_box.appendChild(close),
					div_wrap.appendChild(div_box),
					document.body.appendChild(div_wrap)
				} else {alert("Please refresh the page/log in again")}
			},
			e.send();
		};
	}();
