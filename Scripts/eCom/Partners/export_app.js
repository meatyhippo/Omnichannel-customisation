(()=>{
	let app = document.querySelectorAll('.top h1')[0].innerText
	window.csv = '';
	let firstcall = location.origin+location.pathname+location.search+'&limit=50&page=1'; //https://seoshop.webshopapp.com/partners/apps/app/statistics?app=3544
	let count = 0;
	function getPage(url){
		$.get(url,
			function (data) {
				if (count==0){
					let l = '';
					$(data).find('table>thead>tr>th').each((i,headcell)=>{
						l+=headcell.innerText;
						l+=';';
					})
					csv+=l;
					csv+='\r\n';
				}
				$(data).find('table>tbody>tr').each((i,row)=>{
					let l = "";
					$(row).find('td').each((n,cell)=>{
						l+=cell.innerText.trim();
						l+=';';
					})
					csv+=l;
					csv+='\r\n';
				});
				try {
					let nextpage = $(data).find('ul li.next a:not(".disabled")')[0].href;
					/**/console.log('next page to get:', nextpage);
					count++;
					getPage(nextpage);
				} catch (e){
					//console.log(e);
					//console.log(csv);
				}
			},
			"html"
		);
	}
	getPage(firstcall);
	// when finished - export file + log
	$(document).ajaxStop(function(){
		console.log('DONE, downloading...');
		setTimeout(() => {
			/**/console.log(csv);
			DL_();
		}, 500);
		$(document).off("ajaxStop"); // remove ajaxstop to avoid double download
	});
	function DL_(){
        var today = new Date();
        var blob = new Blob([csv]);
        var file = document.createElement('a');
        file.href = window.URL.createObjectURL(blob, {type: "text/plain"}),
        file.download = app+'|'+today.getDate()+'/'+today.getMonth()+'/'+today.getFullYear()+'.csv',
        file.click();
    }
})();