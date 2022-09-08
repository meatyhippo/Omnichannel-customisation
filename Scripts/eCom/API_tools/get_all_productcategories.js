const axios = require('axios'),
Bottleneck = require('bottleneck');
let key = "01af8360f9251290f3719dba2d8c652d",
	secret = "ecb343c784b95f98bda39dec85818d3d",
	baseurl =`https://${key}:${secret}@api.webshopapp.com/`,
	limiter = new Bottleneck({
		reservoir: 1000,
		reservoirRefreshAmount: 1000,
		reservoirRefreshInterval: 5*60*1000,
		maxConcurrent: 1,
		minTime: (1000/10),
		timeout: 500000
	}),
	totalcount = 294949;
	let list  = {};
	limiter.on("idle", function () {
		/**/console.log('waiting for reset...');
	});
	limiter.on("error", function (error) {
		/**/console.log(error);
	});

const get_all_productcategories = (i) =>{
		axios(baseurl+'en/categories/products.json?limit=250&page='+i).then(response=>{
			let res = response.data
			/**/console.log(
				`#${i*250} out of ${totalcount} --> ${i*250/totalcount*100} \n`,
				"calls left: \n",
				response.headers["x-ratelimit-remaining"],"\n",
				response.headers["x-ratelimit-limit"]
			);
			//console.log(res.categoriesProducts.length);
			if(res.categoriesProducts.length>0){
				//console.log('categories',JSON.stringify(res.categoriesProducts,null,2));
				res.categoriesProducts.forEach(element => {
					if (list[element.product.resource.id] === undefined){
						list[element.product.resource.id] = [];
					}
					list[element.product.resource.id].push(element.id);
				});
				/**/console.log(
					Object.keys(list).length,
					'\n -------------------'
				)
			} else {
				setTimeout(() => {					
					/**/console.log(
						list,
						'\n -------------------',
						"\n done"
					)
				}, 2000);
			}
		})
		.catch(error=>{
			/**/console.log(error);
		});
}
for (i = 1; (i*250) <= (totalcount +500) ; ++i) {
	limiter.schedule(get_all_productcategories, i).then(response=>{});
}