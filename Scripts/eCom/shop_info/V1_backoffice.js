//V1_backoffice
(()=>{
	if (window.Jquery){console.log('Jq Ready');}else{
		let Jq = document.createElement('script');
		Jq.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js'),
		Jq.id='jq',
		document.head.appendChild(Jq);
		window.setTimeout((()=>{main();}),500)
	}
	function row(nr,colnr,title,link,selector){
		switch(location.pathname){
			case '/backoffice/admin-shops/edit':
				/**/console.log();
				let infotable = $('#shop_user_info table tbody');
				let tr = infotable.find('tr')[nr];
				label = $(tr).find('.label-holder')[colnr]; label.innerHTML = '<strong>'+title+'</strong>';
				info = $(tr).find('.info-holder')[colnr]; info.innerHTML = link;
				if(selector){
					$.ajax({
						type: "GET",
						url: "https://seoshop.webshopapp.com/backoffice/admin-shops/edit?tab=subscription&id=265697",
						dataType: "html",
						success: function (response) {
							let ht = $.parseHTML(response);
							/**/console.log(ht);
							/**/console.log($(ht).find('select[name="status"] option[selected="selected"]'));
						}
					});
				}
				break;
			case '/backoffice/admin-partners/statistics/view_item':
				$.getScript(`https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${version}/Scripts/eCom/export_app_users.js`, function (script, textStatus, jqXHR) {
					/**/console.info('Loading app user download script');
				});
				break;
			case '/':
				break;
			default:
				break;
		}
	};
	function main(){
		$('body').append('<div id="jqdata"></div>');

		// /admin-shops/ - function row(nr,colnr,title,link,selector)
		// nr = row in shop info table (starting at 0)
		// colnr = column in the row above (starting at 0)
		// title = title for the edited info
		// link = possible link to another page
		// selector = possible object from ajax call
		// https://seoshop.webshopapp.com/backoffice/core/setshop.do?id=265697
		/*1,0*/row(1,1,'Go To: ',`<a onclick="let id=window.prompt('shopid?','');if(id==null)return;else window.location=location.origin+'/backoffice/core/setshop.do?id='+id">Enter Shop id</a>`,0);
		/*2,0*/row(2,1,'Status: ','',0);
		row(3,0,'Theme: ','',),row(3,1,'Subscription price','',0);
		/*4,0*/row(4,1,'Monthly app fee','',0);
		/*5,0*/row(5,1,'API keys');
		/*6,0*/row(6,1,'App users export');
		/*7,0*/ /*7,1*/;
		/*8,0*/ /*8,1*/;
		row(9,0,'omni customer: ','')/*9,1*/;
	}
})();


