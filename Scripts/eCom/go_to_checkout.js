function go_to_checkout(checkout_type){
	Array.prototype.random = function () {
		return this[Math.floor((Math.random()*this.length))];
	}
	!function(){
		let vids = [];
		let randomProduct = "";
		var t = new XMLHttpRequest();
		t.open("GET", location.origin+"/collection?format=json", false),
		t.onload = function(){
		if ( t.status >= 200 && t.status < 400 ){
				let products = JSON.parse(t.responseText).collection.products;
				for (const key in products) {
					if (Object.hasOwnProperty.call(products, key)) {
						if(products[key].available){
							vids.push(products[key]);
						}
					}
				};
			}
		},
		t.send();
		function verify(){
			randomProduct = vids.random();
			/**/console.log(randomProduct);
			var url = location.origin+'/'+randomProduct.url+"?format=json";
			var e = new XMLHttpRequest();
			e.open("GET", url, false),
			e.onload = function(){
			if ( e.status >= 200 && e.status < 400 ){
					let f = JSON.parse(e.responseText).product;
					f.custom?verify():posting(randomProduct.vid);
				}
			},
			e.send();
		}
		verify();
	}();
	function posting(VID){
		var url = location.origin+"/cart/add/"+VID;
		var e = new XMLHttpRequest();
		e.open("POST", url, true),
		e.onload = function(){
		if ( e.status >= 200 && e.status < 400 ){
				/**/console.log('success: 200');
			}
		},
		e.send();
		setTimeout(function(){checkout_type=='cart'?window.location.href=location.origin+'/cart/':window.location.href=location.origin+'/checkout/'+checkout_type},1000)
	}
}