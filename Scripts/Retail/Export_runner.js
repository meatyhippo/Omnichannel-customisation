(()=>{
	(()=>{
	//add papaparse to page
        if (document.getElementById('Parser')){console.log('Ready to parse');}else{
            let PapaParse = document.createElement('script');
            PapaParse.id = 'Parser',
            PapaParse.setAttribute('src','https://cdn.jsdelivr.net/gh/mholt/PapaParse/papaparse.min.js'),
            document.head.appendChild(PapaParse);
        }
    // create tool_box - tool_wrapper with close
        div_wrap = document.createElement('div'),
        div_wrap.id = 'tool_wrapper',
        div_wrap.onclick = function(){document.body.removeChild(div_wrap);clearInterval(x);};
        div = document.createElement('div'),
		div.onclick = function(evt){evt.stopPropagation();},
        div.id = 'types';
    // ------------------- info
        check = document.createElement('input'),
        check.id = 'nodownload',
        check.type = 'checkbox',
        div.appendChild(check);
        check.insertAdjacentHTML('afterend',
        '<p style="margin:0;color:lightpink">-------------------</br>What\'s new: </p><ul style="margin:0;color:lightpink;"><li>Big update! Did a whole rework of the tool.</br>No more fast/slow mode, only fast! The tool will determine how large the account is and will throttle accordingly.</br>There is an option to automatically download or not though.</li><li>There is a small status report in UI when finished and a progess bar.</li><li>Tags, VendorID\'s and images have been tested and should work without issues now.</li><li>Images includes the matrix ID, you can use this to find matrices with too many images for omni!</li></ul>'),
        check.insertAdjacentHTML('afterend',
        '<p style="margin:0 0 0 10px; color:lightpink; display:inline; ">Don\'t automatically download (will log to console)</p>'),
        div.setAttribute('style','position:fixed;top: 50%!important;left: 50%!important;transform:translate(-50%,-50%)!important;background-color:#999999;display:block;width:fit-content;padding:0.4em;border-radius:5px;');
    // ------------------- progress bar
		bar = document.createElement('div'),
		bar.setAttribute('style','margin:0;height:20px;background-color:lightpink;color:white;'),
		bar.style.width = '1%',
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
		fullspeed = 'true',
		pitstop,
		rad_id = document.querySelector('#help_account_id > var').innerHTML,
		attr = "@attributes",
		base_url = `${window.origin}/API/Account/${rad_id}/`,
		donecount = count = start_id = offset = 0,
		query = ''; //variables for different functions
// add new here
    n_('ItemTags','Item','"TagRelations.Tag"',0,'all tags of an item separated by commas',tr_items,1);
    n_('VendorIDs','Item','"ItemVendorNums"',0,'all vendorID\'s of an item separated by commas',tr_items,1);
    n_('ItemImages','Item','"Images"',0,'all items with their images. Compare matrix id\'s with amount of images to check image limit in omni',tr_items,1);
    n_('Attributes','Item','"ItemAttributes.ItemAttributeSet"',0,'all items with their attribute sets & attributes separated',tr_items,1);
	n_('Inventory on order','Item','"ItemShops"',0,'all the items and how much inventory is in a PO per location',tr_items,1);
	n_('archived & published','Item',0,'&archived=only&publishToEcom=true','all the items that are both archived and still published to eCom',tr_items,1);
	n_('customfields','Item','"CustomFieldValues"',0,'item custom fields',tr_items,0);
    n_('tags_vendorids','Item','"TagRelations.Tag","ItemVendorNums"',0,'tags & vendorid\'s',tr_items,0);
	n_('Notes','Item','"Note"',0,'all items with their note',tr_items,1);
	n_('Customertags','Customer','"Tags"',0,'customers and their tags',tr_customers,1);
	n_('Customerfields','Customer','"CustomFieldValues"','&archive=1','customers and their custom fields',tr_customers,0);
    n_('Vendors','Vendor','"Contact"',0,'vendors and their contact info',tr_reports,1);
    n_('OrderNumbers','Sale',0,'&referenceNumber=>,0','all of the orders that have been synced from eCom to retail',tr_reports,1);
// function to select export
	function n_(b_name, APIendpoint, relation, question, info_message, tr_category, release){
		a = document.createElement("button"),
		a.setAttribute('style','border-radius:5px;border:0px;margin:0.2em;'),
		a.innerHTML = b_name;
		if(!release)a.id = 'show_this',a.style.display = 'none';
		a.insertAdjacentHTML('beforeEnd',`<p style="margin: 0; padding: 0.3em; width: 20em; border-radius: 5px; position:absolute; top:-9999999px; left:-9999999px; background: white; z-index:99999999;" class="${b_name.split(' ')[0]}_info">This exports: ${info_message}</p>`);
		a.onmouseover = function(event){
			$(this).find('p').css({'top':`${event.y - 5}px`,'left':`${event.x + 5}px`})
		};
		a.onmouseout = function(){
			$(this).find('p').css({'top':`-9999999px`,'left':`-9999999px`})
		};
		a.onclick = function(){
			((question)=>{
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
			})();
			window.continuing = true;
			counts(b_name, APIendpoint, relation);
		};
		tr_category.appendChild(a);
    }
// main loop + callbacks to xml & dl
    function counts(b_name, APIendpoint, relation){
		let url = `${base_url}${APIendpoint}.json?`;
		let primary_id = APIendpoint.toLowerCase()+'ID'; // needs looking into
        if(relation) url += `&load_relations=[${relation}]`;
        if(query.length > 0) url += query;
		$.getJSON(url+'&limit=1',(data, textStatus, jqXHR)=>{
			start_id = parseInt(Object.values(data[APIendpoint])[0],10);
			count = parseInt(data[attr].count,10);
		}).done(()=>{
			for (offset; offset <= count; offset += 100) { // loops until total count
				let uri = `${url}&${APIendpoint.toLowerCase()+'ID'}=>%3D,${start_id}&offset=${offset}`;
				/**
				if (count>20000){
					 pitstop = pitstop ? start_time-pitstop : Date.now();
					if (((pitstop-start_time)/1000) % 5 == 0) fullspeed = 'false';
				} else fullspeed = 'true';
				*/
				// needs work: async variable based on account size + time 

				(count>20000 && offset%200==0) ? fullspeed = 'false': fullspeed = 'true';
				if (continuing){ // catch cancel with mac alt key
					$.getJSON(uri,(t, textStatus, jqXHR)=>{
					},`async:${fullspeed}`).done((t)=>{
						if (b_name === 'OrderNumbers') {
							add_to_csv(b_name,APIendpoint,t);
						} else {
							parse_Data(b_name,APIendpoint,t);
						}
					});
				}
			}
		});
    }
    function parse_Data(b_name,APIendpoint,t){
		function join_object(line,rel_object1,rel_object2){ // function to joing {} objects into one string
			return line[rel_object1][rel_object2].map(key => key.value).join(',');
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
			return n, v; //n+'|%'+v;
		}
		function itemparse(b_name,APIendpoint,line){ // edit json data items add new here
			switch (b_name){
				case 'ItemTags':// Done - tested
					line.Tag = '';
					if(!line.Tags){
					} else if (typeof line.Tags.tag=="string"){
						line.Tag=line.Tags.tag;
					} else {
						line.Tag=line.Tags.tag.join(',');
					}
					delete line.Tags
					break;
				case 'VendorIDs':// Done - tested
					line.vendorID = '';
					if(!line.ItemVendorNums){
					} else if (line.ItemVendorNums.ItemVendorNum.length==undefined){
						line.vendorID = line.ItemVendorNums.ItemVendorNum.value;
					} else {
						line.vendorID = join_object(line,'ItemVendorNums','ItemVendorNum');
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
				case 'Attributes':// needs work on the replace
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
				case 'customfields': //needs testing - function with a switch based on the field type. Pas whole lvl based on amount of fields: single field or multiple fields & return string. If none filled in: no object!
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
				case 'Customerfields': //needs testing - function with a switch based on the field type. Pas whole lvl based on amount of fields: single field or multiple fields & return string
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
				case 'tags_vendorids': // Done - needs testing
					line.Tag = '';
					if(!line.Tags){
					} else if (typeof line.Tags.tag=='string'){
						line.Tag=line.Tags.tag;
					} else {
						line.Tags.tag.forEach((tag,i)=>{
							line.Tag+=(tag)+(i<this.length-1?',':'');
						})
					}
					delete line.Tags
					line.vendorID = '';
					if(!line.ItemVendorNums){
					} else if (line.ItemVendorNums.ItemVendorNum.length==undefined){
						line.vendorID = line.ItemVendorNums.ItemVendorNum.value;
					} else {
						line.vendorID = join_object(line,'ItemVendorNums','ItemVendorNum');
					}
					delete line.ItemVendorNums;
					break;
				case 'Vendors': // Done - needs testing
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
			if (line.defaultVendorID){delete line.defaultVendorID;}
			if (line.Prices) {line.Prices.ItemPrice.forEach( (price) => {line[price.useType] = price.amount;});delete line.Prices;}
			line.delete_columns_to_right = "";
			success_list[donecount] = line[APIendpoint.toLowerCase()+'ID'];
			donecount++;
		}
        if (t[APIendpoint] && count>1 && continuing){
			try {
				t[APIendpoint].forEach((line) => {
					itemparse(b_name,APIendpoint,line);
				});
			} catch (error){ // fallback for if counts ends on 1
				/**/console.log(t[attr],t[APIendpoint]); // only if foreach on item failed
				fail_list.push(t);
				line = t[APIendpoint];
				itemparse(b_name,APIendpoint,line)
			};
            add_to_csv(b_name,APIendpoint,t);
        } else if (t[APIendpoint] && count == 1){
            window.alert('Only one item found, opening in new page (check browser popup blocker)');
            let url = `${window.origin}/?name=item.views.item&form_name=view&tab=details&id=`+t.Item.itemID;
            console.log(t); // only if one item in query
            window.open(url,'_blank');
        } else { window.alert('Not found'); }
    }
// papaparse data & add to csv
    function add_to_csv(b_name,APIendpoint,t,){ 
        csv += Papa.unparse(t[APIendpoint],{
            header: true,
            delimiter: ";",
        });
		/**/console.log('Export name:',b_name,'| Endpoint:',APIendpoint, '| ','Call:',t);
		console.log(csv.length+` characters in csv | items: ${donecount}/${count} | ` + roundToTwo((donecount/count)*100) + '%');
	}
// download button
    function DL_(APIendpoint){
        var today = new Date();
        var blob = new Blob([csv]);
        var file = document.createElement('a');
        file.href = window.URL.createObjectURL(blob, {type: "text/plain"}),
        file.download = today.toString().replace(/ /g,"_")+' '+APIendpoint+'_export.csv',
        file.click();
    }
// progress bar
	let x = window.setInterval(()=>{
		if ((donecount/count) >= 1) {
			clearInterval(x);
		} else {
			document.getElementById('progressbar').style.width = ((donecount/(count+1))*100) + '%';
		}
	}, 200);
// when finished - export file + log
	$(document).ajaxStop(function(APIendpoint) {
		console.log(csv);
		//window.localStorage.setItem('export_file','csv');
		/**/console.log('^done ');
		retail_UI_notification(start_time);
		setTimeout(() => {
			if (document.getElementById('nodownload').checked){}else {DL_(APIendpoint)};
			(()=>{document.body.removeChild(div_wrap);})();
		}, 1000);
		window.setTimeout(() => {
			location.reload();
		}, 60 * 1000);
	});
})();
