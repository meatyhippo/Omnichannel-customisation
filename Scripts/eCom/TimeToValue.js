function GIT_(e){let t=document.createElement("script");t.setAttribute("async",""),t.src=`https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${e}/Scripts/eCom/time_to_value.js`,document.body.append(t);let n=document.createElement("link");n.rel="stylesheet",n.href=`https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${e}/Scripts/eCom/shop_info/info_style.css`,document.head.appendChild(n)}!function(){let e=new XMLHttpRequest;e.open("GET","https://api.github.com/repos/meatyhippo/Omnichannel-customisation/releases",!0),e.responseType="json",e.onload=function(){e.status>=200&&e.status<400&&(window.version=e.response[0].tag_name,console.log("git version "+version),GIT_(version))},e.send()}();
