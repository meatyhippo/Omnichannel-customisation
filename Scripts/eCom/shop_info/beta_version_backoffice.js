//beta_backoffice
//declaring global variables
switch (window.SEOshop.react.shop.reseller_id) {
	case 1:
		clust = "Netherlands";
		break;
	case 14:
		clust = "German";
		break;
	case 15:
		clust = "Spanish";
		break;
	case 19:
		clust = "Russian";
		break;
	case 23:
		clust = "Norwegian";
		break;
	case 28:
		clust = "UK";
		break;
	case 38:
		clust = "US";
		break;
	case 40:
		clust = "CAN";
		break;
	case 42:
		clust = "ROW";
		break;
	case 44:
		clust = "REMEA";
	case 1000:
		clust = "Lightspeed USA";
		break;
	case 1001:
		clust = "Lightspeed Canada";
		break;
	case 1002:
		clust = "Lightspeed Rest of World";
		break;
	case 1003:
		clust = "Lightspeed Australia";
		break;
	default:
		clust = "shop cluster not found";
}
let shop_info = {
	cluster: clust,
	name: window.SEOshop.react.company_name,
	domain: window.SEOshop.react.shop.shop_url,
	shop_id: window.SEOshop.react.shop.id,
	rad_id: window.SEOshop.react.shop.retail_id,
	user: window.SEOshop.react.shop.contract_email,
	theme: {
		title: "",
		developer: "",
		price: ""
	}
};
let y = "";
let x = new XMLHttpRequest();
	x.open("GET", location.origin+"/admin/themes.json", true),
	x.onload = function(){
	if ( x.status >= 200 && x.status < 400 ){
			y = JSON.parse( x.responseText );
			shop_info.theme.title = y.themes[0].en.title;
			shop_info.theme.developer = 'by '+y.themes[0].designer;
			shop_info.theme.price = '@ '+Object.values(y.themes[0].prices)[0].price+' '+Object.values(y.themes[0].prices)[0].type;
        }
    },
    x.send();

!function(){
	var e = new XMLHttpRequest;
	e.open("GET",shop_info.domain+"?format=json",true),
	e.onload = function(){
		if(e.status>=200&&e.status<400){
			var t = JSON.parse(e.responseText);
			function o(e,o,l,n){
				if(row = document.createElement("tr"),col = document.createElement("td"),col.appendChild(document.createTextNode(`${e}:`)),row.appendChild(col),l)
				switch(l){					
					case "themes":
						col = document.createElement("td"),
						col.appendChild(document.createTextNode(`${o}: `)),
						//design of editor
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
						a.target="_blank",
						a.href="https://seoshop.webshopapp.com/backoffice/core/setshop.do?id="+o,
						col.appendChild(a),
						//user
						col.appendChild(document.createTextNode(", ")),
						a = document.createElement("a"),
						a.appendChild(document.createTextNode('user: '+shop_info.user)),
						a.target="_blank",
						a.href=location.origin+'/admin/shop_users',
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
				div_wrap.onclick = function(){
					document.body.removeChild(div_wrap)
				},
				div_box = document.createElement("div"),
				div_box.id = "shop_id_box",
				div_box.onclick = function(e){
					e.stopPropagation()
				},
				v_box = document.createElement("div"),
				v_box.id = "shop_id_version",
				v_box.innerText="v0.1(beta)",

				close = document.createElement("div"),
				close.id = "shop_id_close",
				close.onclick=function(){
					document.body.removeChild(div_wrap)
				},
				table = document.createElement("table"),
				table.id = "shop_id_table",
				tbody=document.createElement("tbody"),
				//function o(e,o,l,n)
				// e = text in first column
				// o = result from json in function list below
				// l = used in the cases in the switch above, also the link
				// n = boolean in the default of the switch
				o("Shop Cluster",shop_info.cluster),
				o("Shop id + primary user",shop_info.shop_id,"admin")
				o("Theme",t.shop.settings.template_editor,"themes"),
				o("Theme cont.",Object.values(shop_info.theme).join(", ")),
				o("Shop status",t.shop.status),
				o("Subscription info",),
				o("B2B",t.shop.b2b),
				o("Languages",`${Object.keys(t.shop.languages).length}: ${Object.keys(t.shop.languages).join(", ")}`,"settings/internationalization"),
				o("Currencies",`${Object.keys(t.shop.currencies).length}: ${Object.keys(t.shop.currencies).join(", ")}`,"settings/internationalization"),
				o("Api/app (js)scripts",Object.keys(t.shop.scripts).length||"None",Object.keys(t.shop.scripts).length&&"store/purchases/apps"),
				o("JSON","Open page JSON",location.origin+location.pathname+".json"+location.search.replace(/^\?{1}/g,"&"),!0);
				table.appendChild(tbody),
				div_box.appendChild(table),
				div_box.appendChild(v_box),
				div_box.appendChild(close),
				div_wrap.appendChild(div_box),
				document.body.appendChild(div_wrap)
			} else {alert("Shop id could not be retrieved!")}
		},
		e.send();
}();
