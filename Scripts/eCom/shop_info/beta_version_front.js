//beta_frontoffice
function front_info(){
	function showmycluster(json, o){
		cluster = json.clusterId,
		reseller = json.resellerId;
		console.log('%o\n^ Cluster info\n-------------------',json);
		$('#reseller').text(clusterlist[json.clusterId][json.resellerId]);
		if (cluster == "eu1"){
			$('#v1')[0].href=`https://seoshop.webshopapp.com/backoffice/core/setshop.do?id=${o}`;
			$('a#show_this.hide')[0].href=`https://staff.webshopapp.com/shops/${o}`;
		} else {
			$('#v1')[0].href=`https://store.shoplightspeed.com/backoffice/core/setshop.do?id=${o}`;
			$('a#show_this.hide')[0].href=`https://staff.shoplightspeed.com/shops/${o}`;
		};
	}
	// fetch cluster info
	
	let clusterlist = {
		"eu1": {1:'Netherlands',14:'German',15:'Spanish',19:'Russian',23:'Norwegian',28:'UK',38:'US',40:'CAN',42:'ROW',44:'REMEA'},"us1": {1: 'SEOshop',1000:'Lightspeed USA',1001:'Lightspeed Canada',1002:'Lightspeed Rest of World',1003:'Lightspeed Australia'}
	},
	themeslist = {
		21763: 'Fusion', 36303: 'Delta Responsive', 38275: 'AmaSEO', 42845: 'Berlin', 51033: 'Supreme', 51973: 'DreamCenter', 64304: 'The Developer', 72806: 'SEOnista', 93064: 'Theme Infinite', 94226: 'The Palisades', 94514: 'Yellowshop', 94612: 'Dream', 97532: 'Theme Paris', 97696: 'SEOriginal', 98282: 'Prague', 99026: 'Bepretty', 99173: 'Simple', 99587: 'Mountain', 102326: 'Conversion', 106139: 'Satisfy', 107426: 'Department V2', 108596: 'The Imperial', 111278: 'Ultimate', 117410: 'Exclusive', 118088: 'Invision', 119219: 'Organici', 122723: 'Mandrill', 123764: 'Elements', 128468: 'Redbanana one pager', 129263: 'Altrium Simple SEO', 129710: 'The Starter', 136988: 'Voila', 137084: 'SEOnovo', 137696: 'Performance', 138380: 'Rhythm', 143465: 'Cartfolio Theme', 148031: 'Austin', 148244: 'Gibbon', 149018: 'Unity Theme | InStijl Media', 150834: 'Croissant', 153089: 'Nova', 156623: 'RePOS', 157064: 'Deviant v2', 159089: 'B2B Pro', 161056: 'Metro', 162415: 'Access', 163173: 'Dixi', 168300: 'Executive', 171512: 'Apéro', 171530: 'Compete', 172647: 'Dynamic', 173725: 'Bon Appétit', 174583: 'Ignite', 175411: 'Switch', 176948: 'Theme Department v3', 177518: 'Persona', 178177: 'Natures Best', 179012: 'Denver'
	},
	url='',cluster,reseller;
	location.pathname.includes('checkouts')?url=location.origin+"?format=json":url=location.origin+location.pathname+"?format=json";
	const resellerData = fetch(location.origin + "/whois.json");
	const shopdata = fetch(url);
	shopdata.then(res=>{
		if(res.status>=200&&res.status<400){
			shopData = res.json().then(t=>{
				(()=>{
					console.log('%o\n^ Shop json info\n-------------------',t),
					div_wrap=document.createElement("div"),
					div_wrap.id = "tool_wrapper",
					div_wrap.onclick = function(){
						document.querySelectorAll('#tool_wrapper').forEach((item,i) => {
							document.body.removeChild(item);
						});
						document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]').forEach((item,i) => {
							document.body.removeChild(item);
						});
					},
					div_box = document.createElement("div"),
					div_box.id = "tool_box",
					div_box.onclick = function(e){
						e.stopPropagation()
					},
					v_box = document.createElement("div"),
					v_box.id = "version",
					v_box.innerHTML='<p>'+version+'</br>what\'s new: just a speed update</p>',
					close = document.createElement("div"),
					close.id = "close",
					close.onclick = function(){
						document.querySelectorAll('#tool_wrapper').forEach((item,i) => {
							document.body.removeChild(item);
						});
					},
					table = document.createElement("table"),
					table.id = "table",
					tbody=document.createElement("tbody");
					table.appendChild(tbody),
					div_box.appendChild(table),
					div_box.appendChild(v_box),
					div_box.appendChild(close),
					div_wrap.appendChild(div_box),
					document.body.appendChild(div_wrap)
				})();
				resellerData.then(r=>{
					r.json().then(json=>{
						if ($('#reseller').length && $('#reseller').length >0){
							showmycluster(json, t.shop.id);
						} else {
							setTimeout(() => {
								showmycluster(json, t.shop.id);
							}, 1000);
						}
					});
				});
				function o(e,o,l,n){
					row = document.createElement("tr"),col = document.createElement("td"),col.appendChild(document.createTextNode(`${e}:`)),row.appendChild(col);
					if(l){
						switch(l){
							case "admin":
								col = document.createElement("td"),
								col.appendChild(document.createTextNode("admin: ")),
								// 1
								a = document.createElement("a"),
								a.appendChild(document.createTextNode(o)),
								a.target="_blank",
								a.href=location.origin+"/"+l,
								col.appendChild(a),
								// 2
								col.appendChild(document.createTextNode(" / ")),
								a = document.createElement("a"),
								a.appendChild(document.createTextNode("V1")),
								a.target="_blank";
								a.id="v1";
								col.appendChild(a),
								// 3
								a = document.createElement("a"),
								a.classList.add('hide'),
								a.id = 'show_this',
								a.appendChild(document.createTextNode(" / Staff")),
								a.target="_blank";
								col.appendChild(a);
								break;
							case 'LStheme':
								col = document.createElement("td");
								if (o==undefined && themeslist[t.shop.theme_id]){
									o = themeslist[t.shop.theme_id]
									a = document.createElement("a"),
									a.appendChild(document.createTextNode(o)),
									a.target="_blank",
									a.href='https://themes.lightspeedhq.com/en/themes/?mode=grid&sort=newest&max=30&min=0&search='+o+'&limit=100',
									col.appendChild(a)
								} else if (o==undefined){
									col.appendChild(document.createTextNode('unknown/custom theme'));
								} else {
									/**/console.log('o', o);
									// 1 theme name + docs
									a = document.createElement("a"),
									a.appendChild(document.createTextNode(o.name)),
									a.target="_blank",
									a.href='https://themes.lightspeedhq.com/en/themes/?mode=grid&sort=newest&max=30&min=0&search='+o.name+'&limit=100',
									col.appendChild(a),
									// 2 developer
									col.appendChild(document.createTextNode(" / ")),
									col.appendChild(document.createTextNode('Developed by ')),
									a = document.createElement("a"),
									a.appendChild(document.createTextNode(o.developer)),
									a.target="_blank",
									a.href='https://themes.lightspeedhq.com/en/themes/?mode=grid&sort=newest&max=30&min=0&search='+o.developer+'&limit=100',
									col.appendChild(a);
									// 3 docs
									col.appendChild(document.createTextNode(" / ")),
									a = document.createElement("a"),
									a.appendChild(document.createTextNode('Docs')),
									a.target="_blank",
									a.href=o.docs,
									col.appendChild(a);
									// 4 extra
								}
								break;
							case "themes":
								col = document.createElement("td"),
								col.appendChild(document.createTextNode(`${o}: `)),
								a = document.createElement("a"),
								o ? (a.appendChild(document.createTextNode("editor")),a.href=`${location.origin}/admin/${l}/${t.shop.theme_id}`)
								:(a.appendChild(document.createTextNode("design")),a.href=`${location.origin}/admin/${l}/${t.shop.theme_id}/editor`),
								a.target="_blank",
								col.appendChild(a),
								col.appendChild(document.createTextNode(" / ")),
								a = document.createElement("a"),
								a.appendChild(document.createTextNode("settings")),
								a.target="_blank",
								a.href=`${location.origin}/admin/themes/${t.shop.theme_id}/editor`,
								col.appendChild(a),
								col.appendChild(document.createTextNode(" / ")),
								a = document.createElement("a"),
								a.appendChild(document.createTextNode("custom css")),
								a.target="_blank",
								a.href=`${location.origin}/admin/themes/${t.shop.theme_id}/editor/css`,
								col.appendChild(a);
								break;
							case "Page":
								col = document.createElement("td"),
								col.appendChild(document.createTextNode(`${o}: `)),
								a = document.createElement("a"),
								a.appendChild(document.createTextNode(t.page.title)),
								a.target="_blank";
								switch (o) {
									case "product":
										a.href=`${location.origin}/admin/products/${t.product.id}`;//product page
										break;
									case "collection":
										if (t.collection.category_id) {
											a.href=`${location.origin}/admin/categories/${t.collection.category_id}`;//category
										} else {
											a.href=`${location.origin}/admin/brands/${t.collection.brand_id}`;//category
										}
										break;
									case "blog":
										a.href=`${location.origin}/admin/articles/${t.article.id}`;//blog article
										break;
									case "brands":
										a.href=`${location.origin}/admin/brands/`;
										break;
									case "textpage":
										a.href=`${location.origin}/admin/pages/`;
										break;
									default:
										a.href=`${location.origin}/admin/`;
										break;
								}
								col.appendChild(a);
								break;
							case "JSON":
								// 1
								col = document.createElement("td"),
								col.appendChild(document.createTextNode(o)),
								a = document.createElement("a"),
								a.appendChild(document.createTextNode('JSON page')),
								a.target="_blank",
								a.href = location.origin+location.pathname+"?format=json"+location.search.replace(/^\?{1}/g,"&"),
								col.appendChild(a);
								// 2
								if (location.pathname.match('.html')){
									col.appendChild(document.createTextNode(" / ")),
									a = document.createElement("a"),
									a.appendChild(document.createTextNode('Ajax page')),
									a.target = "_blank",
									a.href = location.origin+(location.pathname.replace('.html',''))+".ajax",
									col.appendChild(a);
								}
								// 3
								col.appendChild(document.createTextNode(" / ")),
								a = document.createElement("a"),
								a.appendChild(document.createTextNode('dev toolbar')),
								a.target = "_self",
								a.href = location.origin+"/developer/toolbar/?status=show",
								col.appendChild(a);
								break;
							case "reseller":
								col = document.createElement("td");
								col.id = 'reseller';
								break;
							default:
								col = document.createElement("td");
								if (typeof(l)=="string"){
									a = document.createElement("a"),
									a.appendChild(document.createTextNode(o)),
									a.target="_blank",
									a.href= n ? l : `${location.origin}/admin/${l}`,
									col.appendChild(a);
								} else {
									l.forEach((item,i) => {
										a = document.createElement("a"),
										a.appendChild(document.createTextNode(item)),
										a.onclick = function(){
											go_to_checkout(item);
										},
										i==0?'':col.appendChild(document.createTextNode(' / '));
										col.appendChild(a);
									});
								}
								break;
						}
					}else col = document.createElement("td"),col.appendChild(document.createTextNode(o));
					row.appendChild(col),tbody.appendChild(row);
				};
				//function o(e,o,l,n)
				// e = text in first column
				// o = result from json in function list below
				// l = used in the cases in the switch above, also the link in default. put n on true for full link
				// n = boolean in the default of the switch to not have the link append to /admin/
				// 
				o("Shop id",t.shop.id,"admin");
				if (t.shop.settings.retail_id){
					o("Retail id",t.shop.settings.retail_id,`https://radcloud.merchantos.com/?name=system.views.account&form_name=view&id=${t.shop.settings.retail_id}&tab=details`,1);
				};
				o('THEME',window.LS_theme/*?window.LS_theme:'custom theme'*/,'LStheme')
				o("Shop reseller","","reseller"),
				o("Theme editor",t.shop.settings.template_editor,"themes"),
				o("Theme page",t.template,t.shop.settings.template_editor?`themes/${t.shop.theme_id}/templates?key=${t.template}`:""),
				o("BO page",Object.keys(t)[0],"Page");
				o("Shop status",t.shop.status),
				o("B2B",t.shop.b2b),
				o("Languages",`${Object.keys(t.shop.languages).length}: ${Object.keys(t.shop.languages).join(", ")}`,"settings/internationalization"),
				o("Currencies",`${Object.keys(t.shop.currencies).length}: ${Object.keys(t.shop.currencies).join(", ")}`,"settings/internationalization"),
				o("Api/app (js)scripts",Object.keys(t.shop.scripts).length||"None",Object.keys(t.shop.scripts).length&&"store/purchases/apps"),
				o("Open","","JSON"),
				o("Add product & checkout","",['cart','onestep','onepage','default','new']);
				o("Clear session data","Clear session",location.origin+"/session/clear",1);
				if (location.pathname.includes('checkouts')) o('Open checkout in BO',location.pathname.match(/\d+/gm)[0],'checkouts/'+location.pathname.match(/\d+/gm)[0]+'/',0);
				if (location.pathname.includes('/thankyou/')) {
					o("Go to order "+t.order.information.number, t.order.information.id, 'orders/'+t.order.information.id)
				}
				if (t.gtag) {
					o("Google Analytics",t.gtag.gtag_id);
				};
				if (t.fbpixel) {
					o("Facebook Pixel",t.fbpixel.pixel_id);
				};
				if (t.shop.settings.stats.omni_loyalty){
					o("Loyalty id",t.shop.settings.stats.omni_loyalty.loyalty_id);
				};
			});
		} else {
			try{
				let t;
				let url = location.origin+"/manifest.json";
				let e = new XMLHttpRequest();
					e.open("GET", url, true),
					e.onload = function(){
					if ( e.status >= 200 && e.status < 400 ){
							t = JSON.parse( e.responseText );
						}
					},
					e.send();
				setTimeout(function(){console.log(t);},1000);
			} catch(e){
				/**/console.log(e);
				alert("Shop id could not be retrieved! Try the homepage")
			}
		}
	})
	function go_to_checkout(o){function n(n){$.ajax({type:"POST",url:location.origin+"/cart/add/"+n+"/",success:function(n){console.log(n,o),window.location.href="cart"==o?location.origin+"/cart/":"new"==o?location.origin+"/checkouts/":location.origin+"/checkout/"+o}})}Array.prototype.random=function(){return this[Math.floor(Math.random()*this.length)]},function(){function o(){c=t.random(),console.log(c),$.get(location.origin+"/"+c.url+"?format=json",function(t,i,r){let a=t.product;a.custom?o():n(c.vid)},"JSON")}let t=[],c="";$.get(location.origin+"/collection?format=json",function(o,n,c){let i=o.collection.products;for(const o in i)Object.hasOwnProperty.call(i,o)&&i[o].available&&t.push(i[o])},"JSON").done(n=>{o()})}()}
}front_info();