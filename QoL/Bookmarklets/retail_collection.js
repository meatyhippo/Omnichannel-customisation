Javascript:!function(){function e(e){let t=document.createElement("link");t.rel="stylesheet",t.href=`https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${e}/Scripts/Retail/styles.css`,document.head.appendChild(t);let n=document.createElement("script");n.setAttribute("async",""),n.src=`https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${e}/Scripts/Retail/retail_tool_overview.js`,document.body.appendChild(n)}let t=new XMLHttpRequest;t.open("GET","https://api.github.com/repos/meatyhippo/Omnichannel-customisation/releases",!0),t.responseType="json",t.onload=function(){t.status>=200&&t.status<400&&(window.version=t.response[0].tag_name,console.log("git version "+version),e(version))},t.send()}();
