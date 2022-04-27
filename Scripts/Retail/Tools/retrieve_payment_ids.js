(()=>{
	let list = window.prompt('Input comma separated sale id\'s','');
	let string = "";
	list.split(",").forEach(id => {
		$.get(location.origin+'/API/Account/'+merchantos.account.id+'/Sale/'+id+'.json?load_relations=["SalePayments"]',
			function (data, textStatus, jqXHR) {
			},
			'JSON'
		).done(data=>{
			if(data.Sale.SalePayments.SalePayment.length==undefined){
				if(data.Sale.SalePayments.SalePayment.archived=="true")/**/console.log(data.Sale.saleID, data.Sale.SalePayments.SalePayment.salePaymentID);string+=data.Sale.saleID;string+="\t";string+=data.Sale.SalePayments.SalePayment.salePaymentID;string+="\r\n";
			} else data.Sale.SalePayments.SalePayment.forEach((payment) => {
				if (payment.archived=="true") /**/console.log(data.Sale.saleID, payment.salePaymentID);string+=data.Sale.saleID;string+="\t";string+=payment.salePaymentID;string+="\r\n";
			})
		});
	});
	function DL_(){
		var today = new Date();
		var blob = new Blob([string]);
		var file = document.createElement('a');
		file.href = window.URL.createObjectURL(blob, {type: "text/plain"}),
		file.download = today.toString().replace(/ /g,"_")+'_export.csv',
		file.click();
	}
	$(document).ajaxStop(function(){
		DL_();
		setTimeout(() => {
			location.reload();
		}, 30000);
	})
})();