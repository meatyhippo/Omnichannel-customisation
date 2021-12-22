//beta_frontoffice
function front_info(){
	(()=>{
		let e=new XMLHttpRequest, url='';
		location.pathname.includes('checkouts')?url=location.origin+"?format=json":url=location.origin+location.pathname+"?format=json";
		e.open("GET",url,true),
		e.onload = function(){
			if(e.status>=200&&e.status<400){
				let t = JSON.parse(e.responseText);
				(()=>{				
					console.log('%o\n^ Shop json info\n-------------------',t),
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
					v_box.innerHTML='<p>'+version+'</br>what\'s new: in progress: showing the theme names in the storefront</p>',
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
				function o(e,o,l,n){
					if(row = document.createElement("tr"),col = document.createElement("td"),col.appendChild(document.createTextNode(`${e}:`)),row.appendChild(col),l)
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
							if (clust.id >= 1000){
								a.href=`https://store.shoplightspeed.com/backoffice/core/setshop.do?id=${o}`;
							} else {
								a.href=`https://seoshop.webshopapp.com/backoffice/core/setshop.do?id=${o}`;
							};
							col.appendChild(a),
							// 3
							a = document.createElement("a"),
							a.classList.add('hide'),
							a.id = 'show_this',
							a.appendChild(document.createTextNode(" / Staff")),
							a.target="_blank";
							if (clust.id >= 1000){
								a.href=`https://staff.shoplightspeed.com/shops/${o}`;
							} else {
								a.href=`https://staff.webshopapp.com/shops/${o}`;
							};
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
				o("Shop id",t.shop.id,"admin");
			} else {alert("Shop id could not be retrieved! Try the homepage")}
		},
		e.send();
	})();
}front_info();