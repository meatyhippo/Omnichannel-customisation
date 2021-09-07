(()=>{
	//paint box
	(()=>{
	//add papaparse to page
        if (document.getElementById('Parser')){fancy_log(['%cReady to parse','%o'],['success',Papa])}else{
            let PapaParse = document.createElement('script');
            PapaParse.id = 'Parser',
            PapaParse.setAttribute('src','https://cdn.jsdelivr.net/gh/mholt/PapaParse/papaparse.min.js'),
            document.head.appendChild(PapaParse);
			let checkPapa = window.setInterval(()=>{
				if (window.Papa!=undefined) {
					clearInterval(checkPapa);
					fancy_log(['%cReady to parse','%o'],['success',Papa])
				}
			}, 200);
			//document.getElementById('Parser').addEventListener("loadend", (e)=>{/**/console.log(e);/**/});
        }
    // create tool_box - tool_wrapper with close
        div_wrap = document.createElement('div'),
        div_wrap.id = 'tool_wrapper',
        div_wrap.onclick = function(){document.body.removeChild(div_wrap);clearInterval(openbar);};
        div = document.createElement('div'),
		div.onclick = function(evt){evt.stopPropagation();},
        div.id = 'types';
    // ------------------- info
        check = document.createElement('input'),
        check.id = 'nodownload',
        check.type = 'checkbox',
        div.appendChild(check);
        check.insertAdjacentHTML('afterend',
        '<p style="margin:0;color:lightpink">-------------------</br>What\'s new: </p><ul style="margin:0;color:lightpink;"><li>Some bug fixes. Archived & published should work again</li><li>Option to skip the auto download</li><li>There is a small status report in UI when finished and a progess bar.</li></ul>'),
        check.insertAdjacentHTML('afterend',
        '<p style="margin:0 0 0 10px; color:lightpink; display:inline; ">Don\'t automatically download (will log to console)</p>'),
        div.setAttribute('style','position:fixed;top: 50%!important;left: 50%!important;transform:translate(-50%,-50%)!important;background-color:#999999;display:block;width:fit-content;padding:0.4em;border-radius:5px;');
    // ------------------- progress bar
		bar = document.createElement('div'),
		bar.setAttribute('style','margin:0;height:20px;background-color:lightpink;color:white;'),
		bar.style.width = '0.1%',
		bar.id = 'progressbar';
		div.appendChild(bar);
	// ------------------- table with buttons
		table = document.createElement('table'),
		tr_items = document.createElement('tr'),
		tr_items.id = "tr_items",
		table.appendChild(tr_items),
		tr_customers = document.createElement('tr'),
		tr_customers.id = "tr_customers",
		table.appendChild(tr_customers),
		tr_reports = document.createElement('tr'),
		tr_reports.id = "tr_reports",
		table.appendChild(tr_reports);
    // ------------------- append all to body
		div.appendChild(table),
		div_wrap.appendChild(div),
        document.body.appendChild(div_wrap);
	})();
// define variables
	window.success_list = {};
	window.fail_list = [];
	window.csv = '';
	let start_time = Date.now(),
		fullspeed = true,
		pitstop,
		rad_id = window.merchantos.account.id
		attr = "@attributes",
		base_url = `${window.origin}/API/Account/${rad_id}/`,
		donecount = count = start_id = offset = timeout = 0,
		query = ''; //variables for different functions
// add new buttons here
	(()=>{
		n_('ItemTags','Item','"TagRelations.Tag"',0,'all tags of an item separated by commas',tr_items,1);
		n_('VendorIDs','Item','"ItemVendorNums"',0,'all vendorID\'s of an item separated by commas. Together with vendor costs in the same order.',tr_items,1);
		n_('ItemImages','Item','"Images"',0,'all items with their images. Compare matrix id\'s with amount of images to check image limit in omni',tr_items,1);
		n_('Attributes','Item','"ItemAttributes.ItemAttributeSet"',0,'all items with their attribute sets & attributes separated',tr_items,1);
		n_('Inventory on order','Item','"ItemShops"',0,'all the items and how much inventory is in a PO per location',tr_items,1);
		n_('archived & published','Item',0,'&archived=only&publishToEcom=true','all the items that are both archived and still published to eCom',tr_items,1);
		//BUG #9 no longer pulls right items
		n_('customfields','Item','"CustomFieldValues"',0,'item custom fields',tr_items,0);
		n_('tags_vendorids','Item','"TagRelations.Tag","ItemVendorNums"',0,'tags & vendorid\'s',tr_items,0);
		n_('Notes','Item','"Note"',0,'all items with their note',tr_items,1);
		n_('Customertags','Customer','"Tags"',0,'customers and their tags',tr_customers,1);
		n_('Customerfields','Customer','"CustomFieldValues"','&archive=1','customers and their custom fields',tr_customers,0);
		n_('Vendors','Vendor','"Contact"','&archive=1','vendors and their contact info',tr_reports,1);
		n_('OrderNumbers','Sale',0,'&referenceNumber=>,0','all of the orders that have been synced from eCom to retail',tr_reports,1);

	})();
// function used by buttons above to select export
	function n_(b_name, APIendpoint, relation, question, info_message, tr_category, release){
		a = document.createElement("button"),
		a.setAttribute('style','border-radius:5px;border:0px;margin:0.2em;'),
		a.innerHTML = b_name;
		if(!release)a.id = 'show_this',a.style.display = 'none';
		a.insertAdjacentHTML('beforeEnd',`<p style="margin: 0; padding: 0.3em; width: 20em; border-radius: 5px; position:absolute; transform:translate(-9999999px,-9999999px); background: white; z-index:99999999;" class="${b_name.split(' ')[0]}_info">This exports: ${info_message}</p>`);
		a.onmouseover = function(event){
			$(this).find('p').css({"transform":"translate(5px,10px)"});
		};
		a.onmouseout = function(){
			$(this).find('p').css({"transform":"translate(-9999999px,-9999999px)"});
		};
		a.onclick = function(){
			if (!question){
				let manufacturer_sku, custom_sku = window.prompt('Enter a specific custom SKU? Or leave empty (manufacturer is next)','');
				if (custom_sku.length == 0){
					manufacturer_sku = window.prompt('Enter a specific manufacturer SKU? Or leave empty','');
				}
				if (custom_sku.length > 0){
					query += `&customSku=${custom_sku}`;
				} else if (manufacturer_sku.length > 0){
					query += `&manufacturerSku=${manufacturer_sku}`;
				}
			} else if (question.length > 0){
				if (b_name == 'OrderNumbers'){
					let startdate = window.prompt('Enter a start date? (YYYY-MM-DD format) Leave empty for all sales (heavy function)','');
					if (startdate.length > 0){
						let enddate = window.prompt('Want an end date too? Leave empty for "until now" (YYYY-MM-DD format)','');
					}
					if (startdate.length > 0){
						query += `&timeStamp=>,${startdate}`;
					} else if (startdate.length && enddate.length > 0){
						query += `&timeStamp=><,${startdate},${enddate}`;
					}
				}
				query += question;
			}
			window.continuing = true;
			counts(b_name, APIendpoint, relation);
		};
		tr_category.appendChild(a);
    }
// main loop + callbacks to xml & dl
    function counts(b_name, APIendpoint, relation){
		let url = `${base_url}${APIendpoint}.json?`;
        if(relation) url += `&load_relations=[${relation}]`;
        if(query.length > 0) url += query;
		$.getJSON(url+'&limit=1',(data, textStatus, jqXHR)=>{
			start_id = parseInt(Object.values(data[APIendpoint])[0],10);
			count = parseInt(data[attr].count,10);
		}).done(()=>{
			console.groupCollapsed('%cClick me to open logging info','color:Dodgerblue;background: #fff; padding: 2px; margin:2px; border-radius:2px;');
			for (offset; offset <= count; offset += 100) { // loops until total count
				let uri = `${url}&${APIendpoint.toLowerCase()+'ID'}=>%3D,${start_id}&offset=${offset}`;
				// TODO #15 maybe create cookie to prevent multiple quick exports
				(count>40000 && offset%300==0) ? fullspeed = 'false': fullspeed = 'true';
				if (continuing){ // catch cancel with mac alt key
					$.ajax({
						type: "GET",
						url: uri,
						dataType: "JSON",
						async: fullspeed,
						success: (t)=>{
							if (b_name === 'OrderNumbers') {
								add_to_csv(b_name,APIendpoint,t);
							} else {
								parse_Data(b_name,APIendpoint,t);
							}
						}
					});
				} else return retail_UI_notification(start_time);
			}
		});
    }
// parsing the data 100 per page
    function parse_Data(b_name,APIendpoint,t){
		function join_object(line,rel_object1,rel_object2, data){ // function to joing {} objects into one string
			return line[rel_object1][rel_object2].map(key => key[data]).join(',');
		}
		function customfield_switch(line){
			let v = n = '';
			n = (line.name+' '+line.type);
			switch (line.type){
				case 'dates'://needs checking, maybe parsing
					break;
				case 'single_choice'://needs checking: checked/not
					v = line.value.value.length>0?line.value.value:'false';
					break;
				case 'multi_choice':
					v += (line.value.name+',');
					break;
				default:
					v = line.value;
					/*
					Item:
						- string
						- boolean
						- date
						- single_choice
						- multi_choice
						- float
					Customer:
						- integer (float)
						- text (string)
						*/
					break;
			}
			return n, v;
		}
		function itemparse(b_name,APIendpoint,line){ // edit json data items add new here
			switch (b_name){
				case 'ItemTags':// Done - tested
					line.Tag = '';
					if(line.Tags && line.Tags.tag){
						if (typeof line.Tags.tag=='string'){
							line.Tag=line.Tags.tag;
						}
						else {
							try {
								line.Tag=line.Tags.tag.join(',');
							} catch (error) {
								/**/console.error(error, line);
							}
						}
					}
					delete line.Tags
					break;
				case 'VendorIDs':// Done - tested
					line.vendorID = '';
					line.vendorcost = '';
					if(!line.ItemVendorNums){
					} else if (line.ItemVendorNums.ItemVendorNum.length==undefined){
						line.vendorID = line.ItemVendorNums.ItemVendorNum.value;
						line.vendorcost = line.ItemVendorNums.ItemVendorNum.cost;
					} else {
						line.vendorID = join_object(line,'ItemVendorNums','ItemVendorNum','value');
						line.vendorcost = join_object(line,'ItemVendorNums','ItemVendorNum','cost');
					}
					delete line.ItemVendorNums;
					break;
				case 'ItemImages':// Done - tested
					for (i = 0; i <= 12; ++i) {
						let placeImage='Image_url_'+i;
						let placeName='Image_name_'+i;
						line[placeImage]='';
						line[placeName]='';
					};
					if (!line.Images){
					} else if (line.Images.Image.length==undefined){
						line.Image_url_0 = line.Images.Image.baseImageURL + line.Images.Image.publicID + '.png';
						line.Image_name_0 = line.Images.Image.filename;
					} else if (line.Images.Image.length > 1){
						line.Images.Image.forEach((img,i) => {
							let newImage = 'Image'+i;
							let newName = 'Image_name'+i;
							line[newImage] = img.baseImageURL+img.publicID+'.png';
							line[newName] = img.filename;
						});
					}
					delete line.Images;
					break;
				case 'Attributes':// TODO #2 fix replacing last attribute
					delete line.Prices;
					line.Attribute1 = "";
					line.Attribute2 = "";
					line.Attribute3 = "";
					line.ItemAttributeSet = "";
					if (line.ItemAttributes) {
						line.description =  line.description.replace(line.ItemAttributes.attribute1,"").replace(line.ItemAttributes.attribute2,"").replace(line.ItemAttributes.attribute3,"").trim();
						line.ItemAttributeSet = line.ItemAttributes.ItemAttributeSet.name;
						if (line.ItemAttributes.attribute1 == "") {
							line.Attribute1 = line.ItemAttributes.attribute2;
							line.Attribute2 = "";
							line.Attribute3 = "";
						} else {
							line.Attribute1 = line.ItemAttributes.attribute1;
							line.Attribute2 = line.ItemAttributes.attribute2 == "" ? "" : line.ItemAttributes.attribute2;
							line.Attribute3 = line.ItemAttributes.attribute3 == "" ? "" : line.ItemAttributes.attribute3;
						};
					}
					delete line.ItemAttributes;
					break;
				case 'Notes': // Done - tested
					line.Notes = '';
					line.note_public= '';
					if (line.Note) {
						line.Notes = line.Note.note;
						line.note_public = line.Note.isPublic;
					}
					delete line.Note;
					break;
				case 'Inventory on order': //Done - tested
					line.ItemShops.ItemShop.forEach((shop)=>{
						if(shop.shopID != 0){
							line['qoh shopid_'+shop.shopID] = shop.qoh;
							line['on order shopid_'+shop.shopID] = shop.backorder;
						} else {
							line['total qoh shopid_'] = shop.qoh;
							line['total on order shopid_'] = shop.backorder;
						}
					})
					delete line.ItemShops;
					break;
				case 'Customertags': // Done - needs testing
					line.birth_date = '';
					line.customertags = '';
					if (line.dob && line.dob > 0) {
						line.birth_date += line.dob;
					}
					if(!line.Tags){
					} else if (typeof line.Tags.tag=="string"){
						line.customertags = line.Tags.Tag.name;
					} else {
						line.customertags = line.Tags.tag.join(','); //maybe line.Tags.tag.name
					}
					delete line.dob;
					delete line.Tags;
					break;
				case 'customfields': //TODO #4 needs testing - function with a switch based on the field type. Pas whole lvl based on amount of fields: single field or multiple fields & return string. If none filled in: no object!
					if (!line.CustomFieldValues){
					} else if (line.CustomFieldValues && line.CustomFieldValue.length==undefined){ //only for 1 custom field
						customfield_switch(line.CustomFieldValues.CustomFieldValue);
						line[n] = v;
					} else {
						line.CustomFieldValues.forEach(x => {
							customfield_switch(x.CustomFieldValue);
							line[n] = v;	
						});
					}
					delete line.CustomFieldValues;
					break;
				case 'Customerfields': //TODO #5 same as 4
					if (!line.CustomFieldValues){
						window.alert('no custom fields');
					} else if (line.CustomFieldValues && line.CustomFieldValue.length==undefined){ //only for 1 custom field
						customfield_switch(line.CustomFieldValues.CustomFieldValue);
						line[n] = v;
					} else {
						line.CustomFieldValues.forEach(x => {
							customfield_switch(x.CustomFieldValue);
							line[n] = v;	
						});
					}
					delete line.CustomFieldValues;
					break;
				case 'tags_vendorids': // Done - TODO #6 testing
					line.Tag = '';
					if(line.Tags && line.Tags.tag){
						if (typeof line.Tags.tag=='string'){
							line.Tag=line.Tags.tag;
						}
						else {
							try {
								line.Tag=line.Tags.tag.join(',');
							} catch (error) {
								/**/console.error(error, line);
							}
						}
					}
					delete line.Tags
					line.vendorID = '';
					if(!line.ItemVendorNums){
					} else if (line.ItemVendorNums.ItemVendorNum.length==undefined){
						line.vendorID = line.ItemVendorNums.ItemVendorNum.value;
					} else {
						line.vendorID = join_object(line,'ItemVendorNums','ItemVendorNum','value');
					}
					delete line.ItemVendorNums;
					break;
				case 'Vendors': // Done - TODO #7 testing
					line.primary_vendor_email = "";
					line.secondary_vendor_email = "";
					line.contactfirstname = "";
					line.contactlastname = "";
					if (line.Contact){
						if (line.Contact.Emails.ContactEmail && line.Contact.Emails.ContactEmail.length > 1){
							line.primary_vendor_email = line.Contact.Emails.ContactEmail[0].address;
							line.secondary_vendor_email = line.Contact.Emails.ContactEmail[1].address;
						} else if (line.Contact.Emails.ContactEmail){
							line.primary_vendor_email = line.Contact.Emails.ContactEmail.address;
						}
						delete line.Contact;
					}
					if (line.Reps){
						line.contactfirstname = line.Reps.VendorRep.firstName;
						line.contactlastname = line.Reps.VendorRep.lastName;
						delete line.Reps
					}
					break;
				default:
					break;
			}
			//remove all extra data
			if (line.defaultVendorID){line.vendor = line.defaultVendorID;}else line.vendor='';
			if (line.discountable){delete line.discountable;}
			if (line.tax){delete line.tax;}
			if (line.serialized){delete line.serialized;}
			if (line.modelYear){delete line.modelYear;}
			if (line.timeStamp){delete line.timeStamp;}
			if (line.categoryID){delete line.categoryID;}
			if (line.taxClassID){delete line.taxClassID;}
			if (line.departmentID){delete line.departmentID;}
			if (line.itemMatrixID&&b_name!='ItemImages')/* compare itemmatrix id's for too many max images */{delete line.itemMatrixID;}
			if (line.manufacturerID){delete line.manufacturerID;}
			if (line.seasonID){delete line.seasonID;}
			if (line.Prices) {line.Prices.ItemPrice.forEach( (price) => {line[price.useType] = price.amount;});delete line.Prices;}
			line.delete_columns_to_right = "";
			success_list[donecount] = line[APIendpoint.toLowerCase()+'ID'];
			donecount++;
		}
        if (t[APIendpoint] && count>1 && continuing){
			try {
				t[APIendpoint].forEach((line) => {
					itemparse(b_name,APIendpoint,line); //regular 100 item page parse
				});
			} catch (error){ // catch error when API page is only one product. e.g. for 101 items in account
				/**/console.error('retry for:',error,t[APIendpoint]);
				fail_list.push(t);
				line = t[APIendpoint]; //skip foreach and make the whole endpoint a "line"
				itemparse(b_name,APIendpoint,line);
			};
            add_to_csv(b_name,APIendpoint,t);
        } else if (t[APIendpoint] && count == 1){
            window.alert('Only one item found, opening in new page (check browser popup blocker)');
            let url = `${window.origin}/?name=item.views.item&form_name=view&tab=details&id=`+t.Item.itemID;
            console.warn(t); // only if one item in query
            window.open(url,'_blank');
        } else {if(!continuing=='false')window.alert('Not found'); return }
    }
// papaparse data & add to csv
    function add_to_csv(b_name,APIendpoint,t,){ 
        csv += Papa.unparse(t[APIendpoint],{
            header: true,
            delimiter: ";",
        }); //TODO #14 facy log below
		/**/fancy_log([`%cExport name: ${b_name}`, `%c|Endpoint: ${APIendpoint}`, '%c|Call', '%o'], ['','','', t])
		/**/fancy_log([`%c${csv.length} characters in csv`, `%c|items: ${donecount}/${count} `, '%o'],['blue','blue',roundToTwo((donecount/count)*100)])
	}
// progress bar
	let openbar = window.setInterval(()=>{
		if ((donecount/count) >= 1) {
		} else {
			document.getElementById('progressbar').style.width = ((donecount/(count+1))*100) + '%';
		}
	}, 200);
// download button
    function DL_(APIendpoint){
        var today = new Date();
        var blob = new Blob([csv]);
        var file = document.createElement('a');
        file.href = window.URL.createObjectURL(blob, {type: "text/plain"}),
        file.download = today.toString().replace(/ /g,"_")+' '+APIendpoint+'_export.csv',
        file.click();
    }
// when finished - export file + log
	$(document).ajaxStop(function(APIendpoint) {
		console.groupEnd();
		clearInterval(openbar);
		console.log(csv);
		/**/fancy_log(['%c^DONE'],['success']);
		retail_UI_notification(start_time);
		setTimeout(() => {
			if (!document.getElementById('nodownload').checked){DL_(APIendpoint)};
			document.body.removeChild(div_wrap);
		}, 1000);
		$(document).off("ajaxStop"); // remove ajaxstop to avoid double download
	});
})();