!function(){
    //define variables
    let domain = location.host;
    let csv, pagenr, maxPage; //variables for different functions
    csv = "";
	let PapaParse = document.createElement('script');
        PapaParse.id = 'Parser',
        PapaParse.setAttribute('src','https://cdn.jsdelivr.net/gh/mholt/PapaParse/papaparse.min.js'),
        document.head.appendChild(PapaParse);
		
    function get_maxPage(){
		$.ajax({
			type: "GET",
			url: `https://${domain}/admin/customers.json`,
			dataType: "JSON",
			success: function (response) {
				maxPage = response.links.pages;
				for (pagenr = 0; pagenr < maxPage; pagenr += 1) {
					$.ajax({
						type: "GET",
						url: `https://${domain}/admin/customers.json?page=${pagenr}`,
						dataType: "JSON",
						async: false,
						success: function (res) {
							res.customers.forEach(customer => {
								delete customer.avatar_url;
								delete customer.billing;
								delete customer.birthdate;
								delete customer.billing_address_formatted;
								delete customer.created_at;
								delete customer.facebook_id;
								delete customer.gender;
								delete customer.gender_pronoun;
								delete customer.is_company;
								delete customer.is_confirmed;
								delete customer.is_gdpr_anonymised;
								delete customer.is_offline;
								delete customer.language;
								delete customer.language_id;
								delete customer.full_lastname;
								delete customer.middlename;
								delete customer.national_identification;
								delete customer.nickname;
								delete customer.notify_confirmed;
								delete customer.notify_new;
								delete customer.notify_password;
								delete customer.phone_country_code;
								delete customer.phone_trimmed;
								delete customer.referral_id;
								delete customer.remote_ip;
								delete customer.reset_token;
								delete customer.same_address;
								delete customer.shop_id;
								delete customer.type;
								delete customer.updated_at;
								delete customer.user_agent;
								delete customer.wishlist;
								delete customer.shipping_address_formatted;
								delete customer.billing_address_country;
								delete customer.shipping_address_country;
								(customer.id && customer.id.length>0)?customer.id = customer.id:customer.id = "";
								(customer.company_coc_number && customer.company_coc_number.length>0)?customer.company_coc_number = customer.company_coc_number:customer.company_coc_number = "";
								(customer.company_name && customer.company_name.length>0)?customer.company_name = customer.company_name:customer.company_name = "";
								(customer.company_vat_number && customer.company_vat_number.length>0)?customer.company_vat_number = customer.company_vat_number:customer.company_vat_number = "";
								(customer.email && customer.email.length>0)?customer.email = customer.email:customer.email = "";
								(customer.firstname && customer.firstname.length>0)?customer.firstname = customer.firstname:customer.firstname = "";
								(customer.lastname && customer.lastname.length>0)?customer.lastname = customer.lastname:customer.lastname = "";
								(customer.orders_count && customer.orders_count.length>0)?customer.orders_count = customer.orders_count:customer.orders_count = "";
								(customer.last_order_at && customer.last_order_at.length>0)?customer.last_order_at = customer.last_order_at:customer.last_order_at = "";
								(customer.last_order_id && customer.last_order_id.length>0)?customer.last_order_id = customer.last_order_id:customer.last_order_id = "";
								(customer.total_spent && customer.total_spent.length>0)?customer.total_spent = customer.total_spent:customer.total_spent = "";
								(customer.memo && customer.memo.length>0)?customer.memo = customer.memo:customer.memo = "";
								(customer.mobile && customer.mobile.length>0)?customer.mobile = customer.mobile:customer.mobile = "";
								(customer.phone && customer.phone.length>0)?customer.phone = customer.phone:customer.phone = "";
								(customer.shipping_address_address1 && customer.shipping_address_address1.length>0)?customer.shipping_address_address1 = customer.shipping_address_address1:customer.shipping_address_address1 = "";
								(customer.shipping_address_address2 && customer.shipping_address_address2.length>0)?customer.shipping_address_address2 = customer.shipping_address_address2:customer.shipping_address_address2 = "";
								(customer.shipping_address_attention && customer.shipping_address_attention.length>0)?customer.shipping_address_attention = customer.shipping_address_attention:customer.shipping_address_attention = "";
								(customer.shipping_address_city && customer.shipping_address_city.length>0)?customer.shipping_address_city = customer.shipping_address_city:customer.shipping_address_city = "";
								(customer.shipping_address_company && customer.shipping_address_company.length>0)?customer.shipping_address_company = customer.shipping_address_company:customer.shipping_address_company = "";
								(customer.shipping_address_country_id && customer.shipping_address_country_id.length>0)?customer.shipping_address_country_id = customer.shipping_address_country_id:customer.shipping_address_country_id = "";
								(customer.shipping_address_extension && customer.shipping_address_extension.length>0)?customer.shipping_address_extension = customer.shipping_address_extension:customer.shipping_address_extension = "";
								(customer.shipping_address_number && customer.shipping_address_number.length>0)?customer.shipping_address_number = customer.shipping_address_number:customer.shipping_address_number = "";
								(customer.shipping_address_region_id && customer.shipping_address_region_id.length>0)?customer.shipping_address_region_id = customer.shipping_address_region_id:customer.shipping_address_region_id = "";
								(customer.shipping_address_region_name && customer.shipping_address_region_name.length>0)?customer.shipping_address_region_name = customer.shipping_address_region_name:customer.shipping_address_region_name = "";
								(customer.shipping_address_zipcode && customer.shipping_address_zipcode.length>0)?customer.shipping_address_zipcode = customer.shipping_address_zipcode:customer.shipping_address_zipcode = "";
								(customer.billing_address_address1 && customer.billing_address_address1.length>0)?customer.billing_address_address1 = customer.billing_address_address1:customer.billing_address_address1 = "";
								(customer.billing_address_address2 && customer.billing_address_address2.length>0)?customer.billing_address_address2 = customer.billing_address_address2:customer.billing_address_address2 = "";
								(customer.billing_address_attention && customer.billing_address_attention.length>0)?customer.billing_address_attention = customer.billing_address_attention:customer.billing_address_attention = "";
								(customer.billing_address_city && customer.billing_address_city.length>0)?customer.billing_address_city = customer.billing_address_city:customer.billing_address_city = "";
								(customer.billing_address_country_id && customer.billing_address_country_id.length>0)?customer.billing_address_country_id = customer.billing_address_country_id:customer.billing_address_country_id = "";
								(customer.billing_address_extension && customer.billing_address_extension.length>0)?customer.billing_address_extension = customer.billing_address_extension:customer.billing_address_extension = "";
								(customer.billing_address_number && customer.billing_address_number.length>0)?customer.billing_address_number = customer.billing_address_number:customer.billing_address_number = "";
								(customer.billing_address_region_id && customer.billing_address_region_id.length>0)?customer.billing_address_region_id = customer.billing_address_region_id:customer.billing_address_region_id = "";
								(customer.billing_address_region_name && customer.billing_address_region_name.length>0)?customer.billing_address_region_name = customer.billing_address_region_name:customer.billing_address_region_name = "";
								(customer.billing_address_zipcode && customer.billing_address_zipcode.length>0)?customer.billing_address_zipcode = customer.billing_address_zipcode:customer.billing_address_zipcode = "";
								customer.delete_to_my_right = "";
							});
							unparse_(res.customers);
						}
					});
				};		
			}
		});
    }
    //papaparse data
    function unparse_(data){
        csv += Papa.unparse(data,{
            header: true,
            delimiter: ";",
        });
        console.log(csv.length+` characters in csv | page: ${pagenr}/${maxPage} | ` + ((pagenr/maxPage)*100) + '%');
        if(pagenr + 1 >= maxPage){
            console.log(csv);
            setTimeout(DL_, 2 * 1000);
        }
    }
    //download button
    function DL_(){
        var today = new Date();
        var blob = new Blob([csv]);
        var file = document.createElement('a');
        file.href = window.URL.createObjectURL(blob, {type: "text/plain"}),
        file.download = today.toString().replace(/ /g,"_")+'_export.csv',
        file.click();
    }
    get_maxPage();
}();