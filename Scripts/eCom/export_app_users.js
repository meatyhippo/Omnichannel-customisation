(()=>{
	let pages = document.querySelectorAll('.pages select[name] option');
	let x = "";
	if (pages.length>0){
		for(let i = 0; i < pages.length; i++){
			let url = location.origin+location.pathname+location.search.split("&")[0]+'&td='+pages[i].value;
			/**/console.log(i,url);
			let e = new XMLHttpRequest();
			e.open("GET", url, true),
			e.responseType = "document",
			e.onload = function(){
				if ( e.status >= 200 && e.status < 400 ){
					/**/console.log('call', e);
					e.response.forms[0].querySelectorAll('div.row').forEach((line) => {
						let u = "";
						line.querySelectorAll('div').forEach((str) => {
							u+=str.innerText;
							u+='\t';
						})
						x += u;
						x += '\r\n';
						console.log(x);
					});
				}
			},
			e.send();
		}
	} else {
		document.querySelectorAll('form[method="post"] div.row').forEach((item) => {
			let u = item.innerText.replace(/\n/gm,'\t');
			x += u;
			x += '\r\n';
		})
		/**/console.log(x);
	}
})();