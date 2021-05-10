let list = [];
function loops(){
	list.forEach((custo,i) => {
		let body = {},
			host = window.origin,
			rad_id = document.querySelector('#help_account_id > var').innerHTML,
			fullurl = `${host}/API/Account/${rad_id}/Customer/${custo}.json`,
			settings = {
				method: "DELETE",
				url: fullurl,
				async:false,
				data: body,
				success: ()=>{/**/console.log(i+ ' - ' +custo+ ' - archived');},
				error: ()=>{/**/console.log('error');},
				dataType: "json"
			};
		try {
			$.ajax(settings);
		} catch (error) {
			console.log('waiting',error);
			setTimeout(() => {
				loops();
			}, 10000);
		}
	});
};loops();