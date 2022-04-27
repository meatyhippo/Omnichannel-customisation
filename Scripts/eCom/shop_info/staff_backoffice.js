function go(){
	let shop_to_go = window.prompt('shop id?','');
	if(shop_to_go && shop_to_go){
		window.location = `${location.origin}/shops/${shop_to_go}`
	} else {}
}go();