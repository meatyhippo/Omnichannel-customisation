//beta_frontoffice
!function(){
	let dom = [];
	function shop_json(clust,DNS_) {
	var e = new XMLHttpRequest;
	e.open("GET",location.origin+location.pathname+"?format=json",true),
	e.onload = function(){
		if(e.status>=200&&e.status<400){
			var t = JSON.parse(e.responseText);
			function o(e,o,l,n){
				if(row = document.createElement("tr"),col = document.createElement("td"),col.appendChild(document.createTextNode(`${e}:`)),row.appendChild(col),l)
				switch(l){
					case "admin":
						col = document.createElement("td"),
						col.appendChild(document.createTextNode("admin: ")),
						a = document.createElement("a"),
						a.appendChild(document.createTextNode(o)),
						a.target="_blank",
						a.href=location.origin+"/"+l,
						col.appendChild(a),
						col.appendChild(document.createTextNode(", ")),
						a = document.createElement("a"),
						a.appendChild(document.createTextNode("V1")),
						a.target="_blank";
						if (clust >= 1000){
							a.href=`https://store.shoplightspeed.com/backoffice/core/setshop.do?id=${o}`;
						} else {
							a.href=`https://seoshop.webshopapp.com/backoffice/core/setshop.do?id=${o}`;
						};
						col.appendChild(a);
						break;
					case "themes":
						col = document.createElement("td"),
						col.appendChild(document.createTextNode(`${o}: `)),
						a = document.createElement("a"),
						o ? (a.appendChild(document.createTextNode("editor")),a.href=`${location.origin}/admin/${l}/${t.shop.theme_id}`)
						:(a.appendChild(document.createTextNode("design")),a.href=`${location.origin}/admin/${l}/${t.shop.theme_id}/editor`),
						a.target="_blank",
						col.appendChild(a),
						col.appendChild(document.createTextNode(", ")),
						a = document.createElement("a"),
						a.appendChild(document.createTextNode("settings")),
						a.target="_blank",
						a.href=`${location.origin}/admin/themes/${t.shop.theme_id}/editor`,
						col.appendChild(a),
						col.appendChild(document.createTextNode(", ")),
						a = document.createElement("a"),
						a.appendChild(document.createTextNode("custom css")),
						a.target="_blank",
						a.href=`${location.origin}/admin/themes/${t.shop.theme_id}/editor/css`,
						col.appendChild(a);
						break;
					case "domain":
						col = document.createElement("td"),
						col.appendChild(document.createTextNode(`${o}: `)),
						a = document.createElement("a"),
						a.appendChild(document.createTextNode("domain")),
						a.target="_blank",
						a.href=`${location.origin}/admin/domains`,
						col.appendChild(a),
						col.appendChild(document.createTextNode(", ")),
						a = document.createElement("a"),
						a.appendChild(document.createTextNode("ssl")),
						a.target="_blank",
						a.href=`${location.origin}/admin/ssl_certificates`,
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
					case "DNS":
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
						if (dom.cname && dom.cname.length > 0){
							dom.cname.forEach((record,index) => {
								p = document.createElement("p");
								p.innerHTML = `CNAME: <a target="_blank" href="https://dns.google.com/resolve?name=${location.hostname}&type=CNAME">${record.data}</a>`;
								div.appendChild(p);
							});
						};
						if (dom.a && dom.a.length > 0){
							dom.a.forEach((record) => {
								let ip = record.data.match(/(\d+)/)[0] == 104 ? `` : ` (Not a LS ip)`;
								p = document.createElement("p");
								p.innerHTML = `a: <a target="_blank" href="https://dns.google.com/resolve?name=${location.hostname.replace(/(\w+)\./,"$`")}&type=A">${record.data}</a>${ip}`;
								div.appendChild(p);
							});	
						};
						div.insertAdjacentHTML('beforeend',"<p style='font-weight:700;'>Don't take this at face value, learn more about DNS on <a href='https://confluence.atlightspeed.net/pages/viewpage.action?spaceKey=~youcke.laven&title=Domain+Troubleshooting' target='_blank'>confluence</a>!</p>");
						col.appendChild(div);
						break;
					case "JSON":
						col = document.createElement("td"),
						col.appendChild(document.createTextNode(o)),
						a = document.createElement("a"),
						a.appendChild(document.createTextNode('JSON page')),
						a.target="_blank",
						a.href = location.origin+location.pathname+"?format=json"+location.search.replace(/^\?{1}/g,"&"),
						col.appendChild(a),
						col.appendChild(document.createTextNode(", ")),
						a = document.createElement("a"),
						a.appendChild(document.createTextNode('dev toolbar')),
						a.target = "_self",
						a.href = location.origin+"/developer/toolbar/?status=show",
						col.appendChild(a);
						break;	
					default:
						col = document.createElement("td"),
						l.forEach((item,i) => {
							if (n != 0){
								a = document.createElement("a"),
								a.appendChild(document.createTextNode(o)),
								a.target="_blank",
								a.href= n ? l : `${location.origin}/admin/${l}`,
								col.appendChild(a);
							}else{
								a = document.createElement("a"),
								a.appendChild(document.createTextNode(item)),
								a.onclick = function(){
									go_to_checkout(item);
								},
								col.appendChild(a);
								i=l.lenght-1?'':col.appendChild(document.createTextNode(' / '));
							}
						});
					}
					else col = document.createElement("td"),
					col.appendChild(document.createTextNode(o));
					row.appendChild(col),
					tbody.appendChild(row)
				};
				console.log(t),
				console.log('^Shop json info\n-------------------');
				div_wrap=document.createElement("div"),
				div_wrap.id = "shop_id_wrapper",
				div_wrap.onclick = function(){
					document.body.removeChild(div_wrap),
					document.body.removeChild(document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]')[0])
				},
				div_box = document.createElement("div"),
				div_box.id = "shop_id_box",
				div_box.onclick = function(e){
					e.stopPropagation()
				},
				v_box = document.createElement("div"),
				v_box.id = "shop_id_version",
				v_box.innerHTML='<p>'+version+'</br>what\'s new: Automatically add product & go to chosen checkout</p>',

				close = document.createElement("div"),
				close.id = "shop_id_close",
				close.onclick = function(){
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
				o("Shop id",t.shop.id,"admin"),
				o("Shop Cluster",clust),
				o("Theme editor",t.shop.settings.template_editor,"themes"),
				o("Theme page",t.template,t.shop.settings.template_editor?`themes/${t.shop.theme_id}/templates?key=${t.template}`:""),
				o("BO page",Object.keys(t)[0],"Page");
				if (!t.shop.domain.includes('webshopapp'||'shoplightspeed')){
					o("DNS data","show","DNS");
				};
				o("Shop status",t.shop.status),
				o("B2B",t.shop.b2b),
				o("Languages",`${Object.keys(t.shop.languages).length}: ${Object.keys(t.shop.languages).join(", ")}`,["settings/internationalization"]),
				o("Currencies",`${Object.keys(t.shop.currencies).length}: ${Object.keys(t.shop.currencies).join(", ")}`,["settings/internationalization"]),
				o("Api/app (js)scripts",Object.keys(t.shop.scripts).length||"None",[Object.keys(t.shop.scripts).length&&"store/purchases/apps"]),
				o("JSON","Open: ","JSON"),
				o("Add product & checkout","Choose: ",['onestep','onepage','default'],0);
				if (t.gtag) {
					o("Google Analytics",t.gtag.gtag_id);
				};
				if (t.fbpixel) {
					o("Facebook Pixel",t.fbpixel.pixel_id);
				};
				if (t.shop.settings.stats.omni_loyalty){
					o("Loyalty id",t.shop.settings.stats.omni_loyalty.loyalty_id);
				};
				table.appendChild(tbody),
				div_box.appendChild(table),
				div_box.appendChild(v_box),
				div_box.appendChild(close),
				div_wrap.appendChild(div_box),
				document.body.appendChild(div_wrap)
			} else {alert("Shop id could not be retrieved! Try the homepage")}
		},
		e.send();
	}
	// DNS function
	!function(){
		let domain_CNAME = new XMLHttpRequest();
		domain_CNAME.open("GET","https://dns.google.com/resolve?name="+location.hostname+"&type=CNAME&format=json",true),
		domain_CNAME.onload = function(){
			if (domain_CNAME.status >= 200 && domain_CNAME.status < 400){
				gdom = JSON.parse(domain_CNAME.responseText);
				dom.cname = gdom.Answer;
			}
		},
		domain_CNAME.send();
		let domain_A = new XMLHttpRequest();
		domain_A.open("GET","https://dns.google.com/resolve?name="+location.hostname.replace(/(\w+)\./,"$`")+"&type=A&format=json",true),
		domain_A.onload = function(){
			if (domain_A.status >= 200 && domain_A.status < 400){
				gdom = JSON.parse(domain_A.responseText);
				dom.a = gdom.Answer;
				console.log(dom);
				console.log('^DNS info\n-------------------');
			}
		},
		domain_A.send();
	}();
	// cluster function that runs above
	!function(){
		let clust;
			var cluster = new XMLHttpRequest();
			cluster.open("GET", location.origin + "/whois.json", true),
			cluster.onload = function(){
				if (cluster.status >= 200 && cluster.status < 400){
					var reseller = JSON.parse(cluster.responseText);
					console.log(reseller+'\n^Cluster info\n-------------------');
					clusterlist = {
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
					}
					for (const key in clusterlist) {
						if (key == reseller.resellerId) {
							clust = clusterlist[key];
						}
					};
				}
				shop_json(clust); //only run the rest of the shop info after the cluster is loaded
			},
		cluster.send();
	}();
	function go_to_checkout(o){function t(t){var n=location.origin+"/cart/add/"+t,e=new XMLHttpRequest;e.open("POST",n,!0),e.onload=function(){e.status>=200&&e.status<400&&console.log("success: 200")},e.send(),setTimeout(function(){window.location.href=location.origin+"/checkout/"+o},1e3)}Array.prototype.random=function(){return this[Math.floor(Math.random()*this.length)]},function(){function o(){e=n.random(),console.log(e);var s=location.origin+"/"+e.url+"?format=json",c=new XMLHttpRequest;c.open("GET",s,!1),c.onload=function(){if(c.status>=200&&c.status<400){let n=JSON.parse(c.responseText).product;n.custom?o():t(e.vid)}},c.send()}let n=[],e="";var s=new XMLHttpRequest;s.open("GET",location.origin+"/collection?format=json",!1),s.onload=function(){if(s.status>=200&&s.status<400){let o=JSON.parse(s.responseText).collection.products;for(const t in o)Object.hasOwnProperty.call(o,t)&&o[t].available&&n.push(o[t])}},s.send(),o()}()};
}();