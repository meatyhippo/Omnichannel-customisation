let list = [231304085,231305304,231330021,233246964,233247574,234065758,234065767,239879864];
var https = require('follow-redirects').https;
var fs = require('fs');
var u = '107ee47a495e3fd53d885dfe57d5d217';
var p = '298ea01bda1da282aaa715b5c0c4e8bd';

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
		/**/console.log('res: ',res.path, res.statusCode, res.statusMessage);
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
