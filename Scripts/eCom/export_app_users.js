(()=>{
	let app = document.querySelectorAll('#titlebar h1')[0].innerText.replace('App ','',).replaceAll('"','');
	let pages = document.querySelectorAll('.pages select[name] option');
	let csv = "";
	if (pages.length>0){
		for(let i = 0; i < pages.length; i++){
			let uri = location.origin+location.pathname+location.search.split("&")[0]+'&td='+pages[i].value;
			/**/console.log(i,uri);
			$.ajax({
				type: "GET",
				url: uri,
				dataType: "html",
				success: function (response) {
					/**/console.log(response);
					response.querySelectorAll('div.row').forEach((line) => {
						let u = "";
						line.querySelectorAll('div').forEach((str) => {
							u+=str.innerText;
							u+='\t';
						})
						csv += u;
						csv += '\r\n';
					});
					console.log(csv);
				}
			});

			//let e = new XMLHttpRequest();
			//e.open("GET", uri, true),
			//e.responseType = "document",
			//e.onload = function(){
			//	if ( e.status >= 200 && e.status < 400 ){
			//		/**/console.log('call', e);
			//		e.response.forms[0].querySelectorAll('div.row').forEach((line) => {
			//			let u = "";
			//			line.querySelectorAll('div').forEach((str) => {
			//				u+=str.innerText;
			//				u+='\t';
			//			})
			//			csv += u;
			//			csv += '\r\n';
			//		});
			//	}
			//},
			//e.send();
			//console.log(csv);
		};

		// when finished - export file + log
		$(document).ajaxStop(function(){
			console.log('DONE');
			setTimeout(() => {
				/**/console.log('downloading');
				//DL_();
			}, 5000);
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
		setTimeout(() => {
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
})();