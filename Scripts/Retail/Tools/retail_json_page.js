!function(){
	let domain = window.location.host;
	let RAD = window.merchantos.account.id;
	let searchParams = new URLSearchParams(window.location.search);
	let caps = Array.from(searchParams.get('name').split('.')[0]);
	let firstletter = caps.shift().toUpperCase();
		caps.unshift(firstletter);
	let endpoint = caps.join('');
	let id = searchParams.get('id');
	let baseurl = `https://${domain}/API/Account/${RAD}/${endpoint}/${id}.json?load_relations=all`;
	console.log(baseurl);
	window.open(encodeURI(baseurl));
}();