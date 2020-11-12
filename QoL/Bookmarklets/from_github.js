Javascript:!function(){
	//get github version
	let e = new XMLHttpRequest();
	e.open("GET", "https://api.github.com/repos/meatyhippo/Omnichannel-customisation/releases", true),
	e.responseType = 'json',
	e.onload = function(){
		if ( e.status >= 200 && e.status < 400 ){
			window.version = e.response[0].tag_name;
			console.log("git version "+version);
			GIT_(version);
		}};
	e.send();
	function GIT_(version){
		//append stylesheet to page
		let styling = document.createElement('link');
		styling.rel = "stylesheet",
		styling.href = `https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${version}/Scripts/Retail/styles.css`,
		document.head.appendChild(styling);
		//append overview to page
		let script = document.createElement('script');
		script.setAttribute('async',''),
		script.src = `https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${version}/Scripts/Retail/retail_tool_overview.js`;
		document.body.appendChild(script);
	};
}();