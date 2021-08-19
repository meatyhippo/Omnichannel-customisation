//beta_frontoffice
function front_info(){
	(()=>{
		div_wrap=document.createElement("div"),
		div_wrap.id = "tool_wrapper",
		div_wrap.onclick = function(){
			document.querySelectorAll('#tool_wrapper').forEach((item,i) => {
				document.body.removeChild(item);
			});
			document.body.removeChild(document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]')[0])
		},
		div_box = document.createElement("div"),
		div_box.id = "tool_box",
		div_box.onclick = function(e){
			e.stopPropagation()
		},
		v_box = document.createElement("div"),
		v_box.id = "version",
		v_box.innerHTML='<p>'+version+'</br>what\'s new: session clear + on thank you page, open the order in BO</p>',
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
	var t = JSON.parse(e.responseText);
	function o(e,o,l,n){
		if(row = document.createElement("tr"),col = document.createElement("td"),col.appendChild(document.createTextNode(`${e}:`)),row.appendChild(col),l)
		switch(l){
			case "admin":
				col = document.createElement("td"),
				// 1
				a = document.createElement("a"),
				a.appendChild(document.createTextNode(o)),
				a.target="_self",
				a.href=document.querySelectorAll('#topbar > div.inbox > a')[0].href,
				col.appendChild(a),
				// 2
				col.appendChild(document.createTextNode(" / ")),
				a = document.createElement("a"),
				a.appendChild(document.createTextNode("V2")),
				a.target="_self";
				a.href=`https://${o}.${location.hostname.split('.')[1]}.com`;
				col.appendChild(a),
				// 3
				col.appendChild(document.createTextNode(" / ")),
				a = document.createElement("a"),
				a.classList.add('hide'),
				a.appendChild(document.createTextNode("Switch shops")),
				a.onclick = ()=>{
					let n = window.prompt('Shop number to switch to?','');
					window.location = `https://${n}.${location.hostname.split('.')[1]}.com`
				},
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
			}
			else col = document.createElement("td"),
			col.appendChild(document.createTextNode(o));
			row.appendChild(col),
			tbody.appendChild(row)
	};
	//function o(e,o,l,n)
	// e = text in first column
	// o = result from json in function list below
	// l = used in the cases in the switch above, also the link in default. put n on true for full link
	// n = boolean in the default of the switch to not have the link append to /admin/
	// 
	o("Current shop: "+document.querySelectorAll('#topbar > div.inbox > a')[0].title,document.querySelectorAll('#topbar > div.inbox > a')[0].innerText,"admin");
	if (document.querySelectorAll('#topbar > div.inbox > a')[0].title){
		o("Retail id",t.shop.settings.retail_id,`https://shop.merchantos.com/?name=system.views.account&form_name=view&id=${t.shop.settings.retail_id}&tab=details`,1);
	};
	o("Shop status",t.shop.status),
	o("B2B",t.shop.b2b),
	o("Open","","JSON"),
	o("Add product & checkout","",['cart','onestep','onepage','default','new']);
	o("Clear session data","Clear session",location.origin+"/session/clear",1);
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
}front_info();