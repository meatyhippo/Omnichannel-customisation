function discounts(){
	let totalnr = 0;
		currentnr = 1;
	window.csv = '';
	csv+= '"apply_to"\t"before_tax"\t"code"\t"created_at"\t"end_date"\t"has_limit"\t"id"\t"is_enabled"\t"minimum_after"\t"minimum_amount"\t"shipping_cost"\t"start_date"\t"status"\t"total_quantity"\t"type"\t"updated_at"\t"used_quantity"\t"value"\t"data"';
	function get_discount(currentnr){
		let currentpage = `.json?page=${currentnr}&limit=250`; // manually looping via interval in final lines. This avoids rate limits as well as a stack overflow from using synchronous functions
		fetch(location.origin+"/admin/discount_codes"+currentpage,)
			.then((res) => res.json())
			.then((json) => {
				let pages = json.links,
					data = json.discount_codes;
				totalnr = pages.pages;
				/**/console.log(pages);
				//console.log(JSON.stringify(data));
				data.forEach(discount => {
					csv+='\r\n';
					Object.values(discount).forEach(value=>{
						csv+=JSON.stringify(value)
						csv+='\t'
					});
				});
			});
		};
	let myInterval = window.setInterval(() => {
		if (currentnr==1||currentnr<totalnr){
			get_discount(currentnr);
			currentnr++;
		}else {
			/**/console.log(currentnr, totalnr/currentnr);
			/**/console.log(csv);
			clearInterval(myInterval);
		}
	}, 500);
}discounts();


// -------------------
function discounts2(){
	csv = "",
	totalnr = 0;
	currentpage = `.json?page=1&limit=250`; // manually looping via interval in final lines. This avoids rate limits as well as a stack overflow from using synchronous functions
	function get_discount(currentpage){
		fetch(location.origin+"/admin/discount_codes"+currentpage,)
			.then((res) => { datapromise = res.json()});
		datapromise.then((json) => {let pages = json.links; return pages});
		/**/console.log(pages);
		/**/console.log(currentpage);
		return pages;
	};
	//setInterval(() => {
	//	if (currentnr<1){
	//	}
	//}, 500);
	let test = new Promise(get_discount(currentpage));
	test.then(/**/console.log(pages))
}