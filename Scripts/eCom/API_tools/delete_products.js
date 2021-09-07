let list = [];
var https = require('follow-redirects').https;
var fs = require('fs');
var u = 'd67b9112f2d8a9ca7e1e669d8a578fbb';
var p = 'bfc20c979eb3b0ef7baebf59ea238cbb';

list.forEach((vid) => {
	var options = {
		'method': 'DELETE',
		'hostname': 'api.webshopapp.com',
		'path': `/nl/products/${vid}.json`,
		'auth': `${u}:${p}`
	};
	var req = https.request(options, function (res) {
		var chunks = [];
		let fails = [];
		console.log('res: ',res.path, res.statusCode, res.statusMessage);
		res.on("data", function (chunk) {
			chunks.push(chunk);
			/**/console.log(vid);
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