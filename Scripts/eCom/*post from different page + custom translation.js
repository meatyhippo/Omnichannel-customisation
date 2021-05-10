//post from different page
function postToURL() {
	let url = "/admin/settings/advanced";
	let values = ["_method:patch","utf8:✓","authenticity_token:46f6c9b67c697e0adfa33a220f6b28de931f8e89","settings%5Bshop_setting%5D%5Bservice_returns%5D:0"];
	let form = document.createElement("form");
	form.setAttribute('action',url),form.setAttribute('method','POST'),form.style.display='none';
	document.body.appendChild(form);
	values.forEach((item,i) => {
		input = document.createElement('input');
		input.setAttribute('type','hidden'),input.setAttribute('name',item.split(':')[0]),input.setAttribute('value',item.split(':')[1]);
		form.appendChild(input)
	});
	/**/console.log(form);
    form.submit();
}postToURL();


// "go to different page" and post there
let url = location.origin+'/admin/settings/advanced';
let e = new XMLHttpRequest();
	e.open("GET", url, true),
	e.onload = function(){
	if ( e.status >= 200 && e.status < 400 ){
            /**/console.log(e.response);
			const domparser = new DOMParser();
			let doc = domparser.parseFromString(e.response, "text/html");
			let form = doc.find('form[id*="form_settings_advanced"]');
			/**/console.log(form);
        }
    },
	e.send();

//base script for post
jQuery.post( $('form[id*="form_settings_advanced"]').attr('action'), "",function(data){console.log(data);})
//base data from copy in advanced
_method=patch&utf8=%E2%9C%93&authenticity_token=7e7f2834943cdf50b075937d67c2e2185c92abe2&settings%5Bshop_setting%5D%5Bcustomer_birthdate%5D=disabled&settings%5Bshop_setting%5D%5Bcustomer_company_coc%5D=disabled&settings%5Bshop_setting%5D%5Bcustomer_gender%5D=disabled&settings%5Bshop_setting%5D%5Bcustomer_middlename%5D=disabled&settings%5Bshop_setting%5D%5Bcustomer_national_id%5D=disabled&settings%5Bshop_setting%5D%5Bcustomer_region%5D=disabled&settings%5Bshop_setting%5D%5Bcustomer_company_mode%5D=optional&settings%5Bshop_setting%5D%5Bcustomer_phone%5D=optional&settings%5Bshop_setting%5D%5Bcustomer_mobile%5D=required&settings%5Bshop_setting%5D%5Bcustomer_email%5D=double&settings%5Bshop_setting%5D%5Bcustomer_company_vat%5D=optional&settings%5Bshop_setting%5D%5Baccount_tickets%5D=0&settings%5Bshop_setting%5D%5Baccount_tickets%5D=1&settings%5Bshop_setting%5D%5Bservice_contact%5D=0&settings%5Bshop_setting%5D%5Bservice_contact%5D=1&settings%5Bshop_setting%5D%5Bservice_returns%5D=0&settings%5Bshop_setting%5D%5Bservice_returns%5D=1&settings%5Bshop_setting%5D%5Baccount_password_strength%5D=0&settings%5Bshop_setting%5D%5Bfeedback_bcc_emails%5D=info%40winkelman-zonnepanelen.nl&settings%5Bshop_setting%5D%5Bshow_demobar%5D=0&settings%5Bshop_setting%5D%5Brequire_finance_cost_price%5D=0&settings%5Bshop_setting%5D%5Bcustomer_social%5D=0&settings%5Bshop_setting%5D%5Bcustomer_social%5D=1&settings%5Bshop_setting%5D%5Bcheckout_related_products%5D=0&settings%5Bshop_setting%5D%5Bcheckout_related_products%5D=1&settings%5Bshop_setting%5D%5Bcheckout_coupons%5D=0&settings%5Bshop_setting%5D%5Bcheckout_calculate_shipping%5D=0&settings%5Bshop_setting%5D%5Bcheckout_calculate_shipping%5D=1&settings%5Bshop_setting%5D%5Bcheckout_newsletter%5D=0&settings%5Bshop_setting%5D%5Bcheckout_progress%5D=0&settings%5Bshop_setting%5D%5Bcheckout_progress%5D=1&settings%5Bshop_setting%5D%5Bcheckout_cart%5D=0&settings%5Bshop_setting%5D%5Bhs_codes%5D=0&settings%5Bshop_setting%5D%5Bcheckout_cart_redirect_back%5D=0&settings%5Bshop_setting%5D%5Bcheckout_cart_redirect_back%5D=1&settings%5Bshop_setting%5D%5Bwish_list%5D=0&settings%5Bshop_setting%5D%5Bwish_list%5D=1&settings%5Bshop_setting%5D%5Bcatalog_prices%5D=enabled&settings%5Bshop_setting%5D%5Bcheckout_mode%5D=enabled&settings%5Bshop_setting%5D%5Blegal_mode%5D=normal&settings%5Bshop_setting%5D%5Bcheckout_terms%5D=message_only&settings%5Bshop_setting%5D%5Bcheckout_minimum_amount%5D=0&settings%5Bshop_setting%5D%5Bcatalog_variants%5D=two_or_more&settings%5Bshop_setting%5D%5Bloyalty_id%5D=&settings%5Bshop_setting%5D%5Bcheckout_register%5D=enabled&settings%5Bshop_setting%5D%5Bcheckout_register_address%5D=optional&settings%5Bshop_setting%5D%5Breview_email%5D=0&settings%5Bshop_setting%5D%5Bcatalog_collection_mode%5D=grid&settings%5Bshop_setting%5D%5Bcatalog_collection_sort%5D=default&settings%5Bshop_setting%5D%5Bcatalog_collection_limit%5D=24


let list = {
	fr : {
		'korting':'réduction',
		'aankoop':'achat'
	},
	en : {
		'korting':'discount',
		'aankoop':'purchase'
	}
}
let country = "fr";
	for (const key in list[country]) {
		if (Object.hasOwnProperty.call(list[country], key)) {
			const tran = list[country][key]
			$('.gui-block-content .gui-col2-left-col2').text( function(i, blok){
				/**/console.log(blok);			
				/**/console.log('translate '+key+' with '+tran);
				blok.replace(key,tran)
				/**/console.log(blok);
			})
		}
	}