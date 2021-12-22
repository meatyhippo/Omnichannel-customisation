javascript:function tools(){
    let e = new XMLHttpRequest();
	e.open("GET", "https://api.github.com/repos/meatyhippo/Omnichannel-customisation/releases", true),
	e.responseType = 'json',
    e.onload = ()=>{
        if ( e.status >= 200 && e.status < 400 ){
            window.version = e.response[0].tag_name;
			let l = location.hostname;
            if((l.includes('lightspeedapp.com')||l.includes('merchantos.com'))){
				// RETAIL, NO FUNCTION WHILE IN RAD
				l.includes('radcloud.')?/**/window.alert('Please log into a customer account, don\'t stay in RAD.'):appendproduct('retail','/Scripts/Retail/retail_tool_overview.js');
			} else if(l.includes('staff.')){
				// STAFF BO ECOM
				appendproduct('staff','/Scripts/eCom/shop_info/staff_backoffice.js');
			} else if(window.SEOshop){
				// ECOM V2 BO
				appendproduct('V2_backoffice','/Scripts/eCom/shop_info/beta_version_backoffice.js');
			} else if(l=='seoshop.webshopapp.com'||l=='store.shoplightspeed.com'){
				if (location.pathname.includes('/backoffice')){
					// ECOM V1 BO
					appendproduct('V1_backoffice','/Scripts/eCom/shop_info/V1_backoffice.js');
				} else if(location.pathname.includes('/partners')){
					// ECOM V1 PARTNER PORTAL
					appendproduct('partners_backoffice','/Scripts/eCom/shop_info/partneroffice.js');
				}
			} else if (l.includes('vendhq.com')){
				// VEND BO
				appendproduct('Vend','/Scripts/eCom/shop_info/VEND.js');
			} else if (l.includes('my.shopsettings.com')){
				// ECWID BO
				appendproduct('Ecwid','/Scripts/Ecwid/ECWID_BO.js');
			} else {
				// ECOM STOREFRONT
				appendproduct('eCom frontoffice','/Scripts/eCom/shop_info/beta_version_front.js');
			}
        }},
    e.send();//get latest version from GH
	function appendproduct(product, url){
		//append script to page
		/**/console.log("LS omnichannel tools version - "+version+' - '+product);
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