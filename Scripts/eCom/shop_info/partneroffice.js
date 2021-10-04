(()=>{
	if (location.pathname == '/partners/apps/app/statistics')
	$.getScript(`https://cdn.jsdelivr.net/gh/meatyhippo/Omnichannel-customisation@${version}/Scripts/eCom/Partners/export_app.js`, (script, textStatus, jqXHR)=>{
		/**/console.log(script, textStatus, jqXHR);
	});
})