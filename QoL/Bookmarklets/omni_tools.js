function tools(){
    let e = new XMLHttpRequest();
	e.open("GET", "https://api.github.com/repos/meatyhippo/Omnichannel-customisation/releases", true),
	e.responseType = 'json',
    e.onload = function(){
        if ( e.status >= 200 && e.status < 400 ){
            window.version = e.response[0].tag_name;
            console.log("LS omnichannel tools version - "+version);
			let l = location.host;
            if((l.includes('lightspeedapp.com')||l.includes('merchantos.com'))){
				l.includes('shop.')?/**/window.alert('Please log into a customer account, don\'t stay in RAD.'):appendproduct('retail','/Scripts/Retail/retail_tool_overview.js');
			} else if(l.includes('staff.')){
				appendproduct('staff','/Scripts/eCom/shop_info/staff_backoffice.js');
			} else if(location.pathname.includes('/admin/')){
				appendproduct('V2_backoffice','/Scripts/eCom/shop_info/beta_version_backoffice.js');
			} else if(location.pathname.includes('/backoffice/')){
				appendproduct('V1_backoffice','/Scripts/eCom/shop_info/V1_backoffice.js');
			} else {
				appendproduct('frontoffice','/Scripts/eCom/shop_info/beta_version_front.js');
			}
        }},
    e.send();//get latest version from GH
	function appendproduct(product, url){
		//append script to page
		/**/console.log(product);
		let script_ = document.createElement('script');
		script_.setAttribute('async',''),
		script_.src = `https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${version}`+url;
		document.body.appendChild(script_);
		//append stylesheet to page
		let styling = document.createElement('link');
		styling.rel = "stylesheet",
		styling.href = `https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${version}/Scripts/eCom/shop_info/info_style.css`,
		document.head.appendChild(styling);
	}
}tools();