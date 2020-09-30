!function(){function e(e,o){var n=new XMLHttpRequest;n.open("GET",location.origin+location.pathname+"?format=json",!0),n.onload=function(){if(n.status>=200&&n.status<400){var o=JSON.parse(n.responseText);function d(n,d,i,c){if(row=document.createElement("tr"),col=document.createElement("td"),col.appendChild(document.createTextNode(`${n}:`)),row.appendChild(col),i)switch(i){case"admin":col=document.createElement("td"),col.appendChild(document.createTextNode("admin: ")),a=document.createElement("a"),a.appendChild(document.createTextNode(d)),a.target="_blank",a.href=location.origin+"/"+i,col.appendChild(a),col.appendChild(document.createTextNode(", ")),a=document.createElement("a"),a.appendChild(document.createTextNode("V1")),a.target="_blank",a.href=e>=1e3?`https://store.shoplightspeed.com/backoffice/core/setshop.do?id=${d}`:`https://seoshop.webshopapp.com/backoffice/core/setshop.do?id=${d}`,col.appendChild(a);break;case"themes":col=document.createElement("td"),col.appendChild(document.createTextNode(`${d}: `)),a=document.createElement("a"),d?(a.appendChild(document.createTextNode("editor")),a.href=`${location.origin}/admin/${i}/${o.shop.theme_id}`):(a.appendChild(document.createTextNode("design")),a.href=`${location.origin}/admin/${i}/${o.shop.theme_id}/editor`),a.target="_blank",col.appendChild(a),col.appendChild(document.createTextNode(", ")),a=document.createElement("a"),a.appendChild(document.createTextNode("settings")),a.target="_blank",a.href=`${location.origin}/admin/themes/${o.shop.theme_id}/editor`,col.appendChild(a),col.appendChild(document.createTextNode(", ")),a=document.createElement("a"),a.appendChild(document.createTextNode("custom css")),a.target="_blank",a.href=`${location.origin}/admin/themes/${o.shop.theme_id}/editor/css`,col.appendChild(a);break;case"domain":col=document.createElement("td"),col.appendChild(document.createTextNode(`${d}: `)),a=document.createElement("a"),a.appendChild(document.createTextNode("domain")),a.target="_blank",a.href=`${location.origin}/admin/domains`,col.appendChild(a),col.appendChild(document.createTextNode(", ")),a=document.createElement("a"),a.appendChild(document.createTextNode("ssl")),a.target="_blank",a.href=`${location.origin}/admin/ssl_certificates`,col.appendChild(a);break;case"Page":switch(col=document.createElement("td"),col.appendChild(document.createTextNode(`${d}: `)),a=document.createElement("a"),a.appendChild(document.createTextNode(o.page.title)),a.target="_blank",d){case"product":a.href=`${location.origin}/admin/products/${o.product.id}`;break;case"collection":o.collection.category_id?a.href=`${location.origin}/admin/categories/${o.collection.category_id}`:a.href=`${location.origin}/admin/brands/${o.collection.brand_id}`;break;case"blog":a.href=`${location.origin}/admin/articles/${o.article.id}`;break;case"brands":a.href=`${location.origin}/admin/brands/`;break;case"textpage":a.href=`${location.origin}/admin/pages/`;break;default:a.href=`${location.origin}/admin/`}col.appendChild(a);break;case"DNS":col=document.createElement("td"),a=document.createElement("a"),a.appendChild(document.createTextNode(`${d} `)),a.id="hide_show",a.onclick=function(){$("#ips").toggleClass("hide"),$("#hide_show").innerHTML="hide"},col.appendChild(a),div=document.createElement("div"),div.id="ips",div.classList.add("hide"),t.cname&&t.cname.length>0&&t.cname.forEach((e,t)=>{p=document.createElement("p"),p.innerHTML=`CNAME: <a target="_blank" href="https://dns.google.com/resolve?name=${location.hostname}&type=CNAME">${e.data}</a>`,div.appendChild(p)}),t.a&&t.a.length>0&&t.a.forEach(e=>{let t=104==e.data.match(/(\d+)/)[0]?"":" (Not a LS ip)";p=document.createElement("p"),p.innerHTML=`a: <a target="_blank" href="https://dns.google.com/resolve?name=${location.hostname.replace(/(\w+)\./,"$`")}&type=A">${e.data}</a>${t}`,div.appendChild(p)}),div.insertAdjacentHTML("beforeend","<p style='font-weight:700;'>Don't take this at face value, learn more about DNS on <a href='https://confluence.atlightspeed.net/pages/viewpage.action?spaceKey=~youcke.laven&title=Domain+Troubleshooting' target='_blank'>confluence</a>!</p>"),col.appendChild(div);break;case"JSON":col=document.createElement("td"),col.appendChild(document.createTextNode(d)),a=document.createElement("a"),a.appendChild(document.createTextNode("JSON page")),a.target="_blank",a.href=location.origin+location.pathname+"?format=json"+location.search.replace(/^\?{1}/g,"&"),col.appendChild(a),col.appendChild(document.createTextNode(", ")),a=document.createElement("a"),a.appendChild(document.createTextNode("dev toolbar")),a.target="_self",a.href=location.origin+"/developer/toolbar/?status=show",col.appendChild(a);break;default:col=document.createElement("td"),a=document.createElement("a"),a.appendChild(document.createTextNode(d)),a.target="_blank",a.href=c?i:`${location.origin}/admin/${i}`,col.appendChild(a)}else col=document.createElement("td"),col.appendChild(document.createTextNode(d));row.appendChild(col),tbody.appendChild(row)}console.log(o),console.log("^Shop json info\n-------------------"),div_wrap=document.createElement("div"),div_wrap.id="shop_id_wrapper",div_wrap.onclick=function(){document.body.removeChild(div_wrap),document.body.removeChild(document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]')[0])},div_box=document.createElement("div"),div_box.id="shop_id_box",div_box.onclick=function(e){e.stopPropagation()},v_box=document.createElement("div"),v_box.id="shop_id_version",v_box.innerHTML="<p>"+version+"</br>what's new: Try it in the backoffice!</p>",close=document.createElement("div"),close.id="shop_id_close",close.onclick=function(){document.body.removeChild(div_wrap),document.body.removeChild(document.querySelectorAll('script[src^="https://cdn.jsdelivr.net/gh/meatyhippo/"]')[0])},table=document.createElement("table"),table.id="shop_id_table",tbody=document.createElement("tbody"),d("Shop id",o.shop.id,"admin"),d("Shop Cluster",e),d("Theme editor",o.shop.settings.template_editor,"themes"),d("Theme page",o.template,o.shop.settings.template_editor?`themes/${o.shop.theme_id}/templates?key=${o.template}`:""),d("BO page",Object.keys(o)[0],"Page"),d("SSL mode",o.shop.ssl_mode,"domain"),o.shop.domain.includes("webshopapp")||d("DNS data","show","DNS"),d("Shop status",o.shop.status),d("B2B",o.shop.b2b),d("Languages",`${Object.keys(o.shop.languages).length}: ${Object.keys(o.shop.languages).join(", ")}`,"settings/internationalization"),d("Currencies",`${Object.keys(o.shop.currencies).length}: ${Object.keys(o.shop.currencies).join(", ")}`,"settings/internationalization"),d("Api/app (js)scripts",Object.keys(o.shop.scripts).length||"None",Object.keys(o.shop.scripts).length&&"store/purchases/apps"),d("JSON","Open: ","JSON"),o.gtag&&d("Google Analytics",o.gtag.gtag_id),o.fbpixel&&d("Facebook Pixel",o.fbpixel.pixel_id),o.shop.settings.stats.omni_loyalty&&d("Loyalty id",o.shop.settings.stats.omni_loyalty.loyalty_id),table.appendChild(tbody),div_box.appendChild(table),div_box.appendChild(v_box),div_box.appendChild(close),div_wrap.appendChild(div_box),document.body.appendChild(div_wrap)}else alert("Shop id could not be retrieved!")},n.send()}let t=[];!function(){let e=new XMLHttpRequest;e.open("GET","https://dns.google.com/resolve?name="+location.hostname+"&type=CNAME&format=json",!0),e.onload=function(){e.status>=200&&e.status<400&&(gdom=JSON.parse(e.responseText),t.cname=gdom.Answer)},e.send();let a=new XMLHttpRequest;a.open("GET","https://dns.google.com/resolve?name="+location.hostname.replace(/(\w+)\./,"$`")+"&type=A&format=json",!0),a.onload=function(){a.status>=200&&a.status<400&&(gdom=JSON.parse(a.responseText),t.a=gdom.Answer,console.log(t),console.log("^DNS info\n-------------------"))},a.send()}(),function(){let t;var a=new XMLHttpRequest;a.open("GET",location.origin+"/whois.json",!0),a.onload=function(){if(a.status>=200&&a.status<400){var o=JSON.parse(a.responseText);console.log(o+"\n^Cluster info\n-------------------"),clusterlist={1:"Netherlands",14:"German",15:"Spanish",19:"Russian",23:"Norwegian",28:"UK",38:"US",40:"CAN",42:"ROW",44:"REMEA",1000:"Lightspeed USA",1001:"Lightspeed Canada",1002:"Lightspeed Rest of World",1003:"Lightspeed Australia"};for(const e in clusterlist)e==o.resellerId&&(t=clusterlist[e])}e(t)},a.send()}()}();
