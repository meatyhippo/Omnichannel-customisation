// WARNING: irriversible action!!!!!
// this will first delete all product category relations to products in the list and then add the new ones
// -------------------
//requires two files in the following format:
//categories to delete: 
//	{
//		"product_id": [category_relation_id, category_relation_id, ...]
//	}
//categories to add:
//	{
//		"product_id": [category_id, category_id, ...]
//	}
// be mindful that the first delete function requires the category relation id and not the category id. If you don't know how to get the relation id, take a look at the get_all_product_categories.js script.

//the script is built to work with TWO API KEYS at the same time.
		
//list for possible errors
let fail_list = {},
	keydirection = 21,
	keys = [
		"01af8360f9251290f3719dba2d8c652d",
		"7263cc4e0f53b75a09b8b59721abae4e"
	],
	secrets = [
		"ecb343c784b95f98bda39dec85818d3d",
		"0770ffb5e252a0305dcf1f7ad13a6f35"
	];

const axios = require('axios'),
	Bottleneck = require('bottleneck'),
	productlist = require('./productcategories.json'),
	oldrelation = require('./oldrelations.json'),
	//set rate limts
	limiter = new Bottleneck({
		reservoir: 2000,
		reservoirRefreshAmount: 2000,
		reservoirRefreshInterval: 5*60*1000, // 5 minutes
		maxConcurrent: 1,
		minTime: (1000/10),	//10 calls per second
		timeout: 300000
	}),
	//get total items
	totalitems = Object.keys(productlist).length;


limiter.on("error", function (error) {
	/**/console.log(fail_list);
});

//delete old relations
const deleteRelations = (relation, product, keydirection, key, secret) => {
	axios(`https://${key}:${secret}@api.webshopapp.com/en/categories/products/${relation}.json`,{
		method: 'DELETE'
	})
	.then(response=>{/**/console.log('deleted:',relation, 'from product', product, response.data)})
	.catch(error=>{/**/console.log('error deleting:',relation, 'from product', product, error)})
}
// -------------------
//push new relations to products
const getProducts = (product, i, keydirection, key, secret) => {
	//set body from productlist
	let body = {
	"categoriesProduct": {
		"categories": productlist[product],
		"product": parseInt(product)
		}
	}
	//http request to add categories to product
	axios(`https://${key}:${secret}@api.webshopapp.com/en/categories/products/bulk.json`,
		{
			method: 'POST',
			data: body
		}
	)
	.then(response=>{
		/**/console.log(`current id: ${product} \n ${JSON.stringify(body, null, 2)}`);
		//on product already in category
		if(response.data.errors.length>0){
			/**/console.log(product, "skipped,", response.data.errors);
			fail_list["product"] = response.data.errors;
		} else {
			//console.log(product, "added categories:", JSON.stringify(response.data.categoriesProduct, null, 2))
		}
		/**/console.log( `#${i} out of ${totalitems} --> ${i/totalitems} \n`, "calls left: \n", response.headers["x-ratelimit-remaining"],"\n", response.headers["x-ratelimit-limit"], '\n -------------------');
	})
	.catch(error=>{
		console.log("error adding:",JSON.stringify(error,null,2));
		fail_list["product"] = error.config.data;
	})
}
Object.keys(productlist).forEach((product,i) => {
	if ( i > 20 && i<=30){
		Array.from(oldrelation[product]).forEach((relation, index)=>{
			keydirection++;
			if(keydirection%2 == 0){
				key = keys[0];
				secret = secrets[0];
			} else {
				key = keys[1];
				secret = secrets[1];	
			}
			limiter.schedule(deleteRelations,relation, product, keydirection, key, secret).then(response=>{});
		});
		keydirection++;
		if(keydirection%2 == 0){
			key = keys[0];
			secret = secrets[0];
		} else {
			key = keys[1];
			secret = secrets[1];	
		}
		limiter.schedule(getProducts, product, i, keydirection, key, secret).then(response=>{});
	}
	if(i>=totalitems)/**/console.log('fail list', fail_list);
});