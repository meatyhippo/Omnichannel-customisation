function _resize_table_1(){ //hijack the v1 function to prevent errors
	return;
};
(()=>{
	if (window.Jquery){console.log('Jq Ready');}else{
		let Jq = document.createElement('script');
		Jq.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'),
		Jq.id='jq',
		document.head.appendChild(Jq);
		window.setTimeout((()=>{app();}),500);
	}
})();
function app(){
	let app = document.querySelectorAll('#titlebar h1')[0].innerText.replace('App ','',).replaceAll('"','');
	let pages = document.querySelectorAll('.pages select[name] option');
	window.csv = "";
	if (pages.length>0){
		for(let i = 0; i < pages.length; i++){
			$(body).append(`<div id="page_${i}"></div>`);
			let uri = location.origin+location.pathname+location.search+'&td='+pages[i].value;
			/**/console.log(i,uri);
			$.ajax({
				type: "GET",
				url: uri,
				dataType: "html",
				success: function (response) {
					$(response).find('div.row').each((n,line) => {
						let l = "";
						line.querySelectorAll('div').forEach((cell) => {
							l+=cell.innerText;
							l+='\t';
						})
						csv += l;
						csv += '\r\n';
					});
				}
			});
		};
		// when finished - export file + log
		$(document).ajaxStop(function(){
			console.log('DONE');
			setTimeout(() => {
				/**/console.log('downloading');
				/**/console.log(csv);
				DL_();
			}, 1000);
			$(document).off("ajaxStop"); // remove ajaxstop to avoid double download
		});
	} else {
		document.querySelectorAll('form[method="post"] div.row').forEach((item) => {
			let u = item.innerText.replace(/\n/gm,'\t');
			csv += u;
			csv += '\r\n';
		})
		/**/console.log(csv);
		console.log('DONE');
		//fancy_log(['%c^DONE'],['success']);
		window.setTimeout(() => {
			/**/console.log('downloading');
			DL_();
		}, 1000);
	}
	function DL_(){
        var today = new Date();
        var blob = new Blob([csv]);
        var file = document.createElement('a');
        file.href = window.URL.createObjectURL(blob, {type: "text/plain"}),
        file.download = app+'_'+today.toString().replace(/ /g,"_")+'_export.csv',
        file.click();
    }
}