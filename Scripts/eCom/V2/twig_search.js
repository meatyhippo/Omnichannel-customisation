!function(){
	document.querySelectorAll("#twigSearch").length > 0 && 
	document.querySelectorAll("#twigSearch")
	.forEach(function(e){
		e.remove()
	});
	let theme_url = location.origin+'/admin/themes/'+SEOshop.react.shop.current_theme_id;
	let e = prompt("Search twig files for:");
	e && e.length > 0 && jQuery.getJSON(theme_url + ".json",function(a){
		let t = '<div class="modal bg-visible dialog-visible" id="twigSearch"><div class="dialog small"><header><h2>Search results for "'+e+'":</h2><a class="close" href="#" onclick="document.body.removeChild(twigSearch)"></a></header><div id="modal-content"><div class="body" style="overflow-y: scroll;">' + a.theme.theme_templates.map(a => a.content.toLowerCase().indexOf(e.toLowerCase()) > -1 && '<a href="' + theme_url + "/templates?key=" + a.key + '" target="_blank">' + a.key + "</a>").filter(e => e).join("<br>") + '</div><div class="buttons"><a class="btn close" href="#" title="search" onclick="twigSearchFn()">Search again</a><a class="btn close" href="#" title="close" onclick="document.body.removeChild(twigSearch)">Close</a></div></div></div></div>';
		document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", t)
	})
}();