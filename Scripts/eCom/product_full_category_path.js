(()=>{
	//define variables
	let baseurl = location.origin+'/admin',
		page_limit = 50,
		totalcount,
		count = 0,
		csv = ''; //variables for different functions

	//add papaparse to page
	$.getScript(`https://cdn.jsdelivr.net/gh/mholt/PapaParse/papaparse.min.js`,(script, textStatus)=>{/**/console.info(textStatus, 'loaded Papa');get_products('page=1');});
	function get_products(pagenr){
		if(pagenr != null){
			$.ajax({
				type: 'GET',
				dataType: 'JSON',
				url:`${baseurl}/products.json?limit=${page_limit}&${pagenr}`,
				async:false,
				success:(data, textStatus, jqXHR)=>{
					nextpage = data.links.next.replace('.json?','')||null;
					totalcount = (data.links.pages*page_limit);
					products = data.products;
					/**/console.log(products);
					products.forEach((product,i) => {
						count++
						(()=>{
							delete product.created_at;
							delete product.delivery_date_id;
							delete product.has_custom_fields
							delete product.has_discounts
							delete product.has_matrix
							delete product.hits
							delete product.hs_code
							delete product.image_id
							delete product.is_visible
							delete product.missing_info
							delete product.product_set_id
							delete product.product_type_id
							delete product.search_context
							delete product.shop_id
							delete product.supplier_id
							delete product.updated_at
							delete product.variant_prices
							delete product.variants_count
							delete product.visibility
							delete product.weight
							delete product.variants
							delete product.metafields
							delete product.supplier
							delete product.brand
							delete product.image
	
						})();
						for (i = 0; i <= 20; ++i) {
							let c='category_'+i;
							product[c]='';
						};
						product.delete_columns_to_right = "";
						$.ajax({
							type: 'GET',
							dataType: 'JSON',
							url: `${baseurl}/products/${product.id}.json`,
							async: false,
							success: (response)=>{
								/**/console.log(response.product.id+' processed', `- ${count}/${totalcount}`);
								cats = response.product.product_categories;
								cats.forEach((cat,index) => {
									let newcat = 'category_'+index;
									product[newcat] = cat.category.nl.slug
									/* only longest slugs
									let cats = x.product.product_categories;
									cats.forEach((item,i) => {
										if(cats[i+1].category.nl.slug.match(item.category.nl.slug)){
										} else {
											console.log(item.category.nl.slug)
										}
									})
									*/
								})
							}
						});
					});
					unparse_();
					//papaparse data
					function unparse_(){
						csv += Papa.unparse(products,{
							header: true,
							delimiter: ";",
						});
						console.log(csv.length+' characters in csv');
						console.log(csv);
						//setTimeout(DL_, 2 * 1000);
					}
					get_products(nextpage);
				}
			})
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
	//get_maxPage();
})();