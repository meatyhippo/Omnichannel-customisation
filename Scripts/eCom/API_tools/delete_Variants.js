//let list = [231304085,231305304,231330021,233246964,233247574,234065758,234065767,239879864];
var https = require('follow-redirects').https;
var fs = require('fs');
var u = '0d8a6b3e74b5930bbd5d06f7e68e6126';
var p = 'f30b8380e9bc3f54430e31c494b3b999';


let images_to_delete = {}

(()=>{
    let base_url = location.origin+'/admin/products/';
    let list = [123504629,123504632,123504637,123504645,123504652,123504668,123504703,123504705,123504726,123504734,123504741,123504748,123504749,123504759,123504764,123504772,123504790,123504799,123504813,123504855,123504858,123504874,123504880,123504883,123504886,123504914,123504931,123504943,123504958,123504960,123504979,123504996,123505003,123505005,123505015,123505021,123505028,123505037,123505053,123505059,123505081,123505086,123505090,123505096,123505102,123505106,123505115,123505117,123505123,123505128,123524356,123524363,123524374,123524395,123524405,123524421,123524442,123524450,123524463,123524482,123524497,123524547,123524551,123524560,123524587,123524600,123524609,123524612,123524686,123524690,123524699,123524721,123524730,123524781,123524817,123524837,123524865,123524997,123525051,123525072,123525186,123525240,123525368,123525419,123525447,123525470,123525503,123525515,123525580,123525622,123525639,123525651,123525667,123525674,123525690,123525704,123525719,123525790];
	window.images_to_delete = {};
    list.forEach((item,i) => {
        images_to_delete[item] = [];
        $.get(`${base_url}${item}/images.json`,
        function (data, textStatus, jqXHR) {
            data.product_images.forEach((img,i) => {
                if(i!=0){
                    images_to_delete[item][i] = img.id;
                }
            })
        },
        "JSON"
        );
		/**/console.log(item);
    })
	/**/console.log(images_to_delete);
})();
for (const key in images_to_delete) {
	if (Object.hasOwnProperty.call(images_to_delete, key)) {
		const element = images_to_delete[key];
		element.forEach((vid,i) => {
			var options = {
				'method': 'DELETE',
				'hostname': 'api.webshopapp.com',
				'path': `/fr/products/${key}/images/${vid}.json`,
				'auth': `${u}:${p}`
			};
			var req = https.request(options, function (res) {
				var chunks = [];
				let fails = [];
				/**/console.log(key, vid, 'res: ', res.statusCode, res.statusMessage);
				res.on("data", function (chunk) {
					chunks.push(chunk);
				});
				res.on("end", function (chunk) {
					var body = Buffer.concat(chunks);
					console.log(body.toString());
				});
				res.on("error", function (error) {
					console.error(error);
					fails.push(error);
				});
			});
			req.end();
		});
	}
}

list.forEach((vid,i) => {
	var options = {
		'method': 'DELETE',
		'hostname': 'api.webshopapp.com',
		'path': `/nl/variants/${vid}.json`,
		'auth': `${u}:${p}`
	};
	var req = https.request(options, function (res) {
		var chunks = [];
		let fails = [];
		console.log('res: ',res.path, res.statusCode, res.statusMessage);
		res.on("data", function (chunk) {
			chunks.push(chunk);
		});
		res.on("end", function (chunk) {
			var body = Buffer.concat(chunks);
			console.log(body.toString());
		});
		res.on("error", function (error) {
			console.error(error);
			fails.push(error);
		});
	});
	req.end();
});