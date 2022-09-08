// import matrix desciptions

function MatrixName(){
	const host = window.origin,
	rad_id = document.querySelector('#help_account_id > var').innerHTML;
    //let upload;//------------------- upload file here
	let list = [1520];//upload.split(/\r\n|\n/);
	list.forEach((matrix,i) => {
		if (i!=10){
			let body = {
					"description": "let's séé"
			},
				fullurl = `${host}/API/Account/${rad_id}/ItemMatrix/${matrix}.json`,
				settings = {
					method: "PUT",
					url: fullurl,
					async:false,
					data: JSON.stringify(body),
					success: ()=>{/**/console.log(i+ ' - ' +matrix+ ' - archived');},
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
		}
	});
};MatrixName();