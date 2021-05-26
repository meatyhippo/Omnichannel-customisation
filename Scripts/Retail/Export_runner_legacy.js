!function(){
    //define variables
        let domain = window.location.host;
        let rad_id = document.querySelector('#help_account_id > var').innerHTML;
        let csv, APIendpoint, relation, query, report, manufacturer_sku, info_message, pagenr, maxPage; //variables for different functions
        csv = APIendpoint = relation = query = info_message = "";
        function query_(){
            if (report == 'OrderNumbers'){} else {
                let custom_sku = window.prompt('Enter a specific custom SKU? Or leave empty (manufacturer is next)','');
                if (custom_sku.length == 0){
                    manufacturer_sku = window.prompt('Enter a specific manufacturer SKU? Or leave empty','');
                }
                if (custom_sku.length > 0){
                    query += `&customSku=${custom_sku}`;
                } else if (manufacturer_sku.length > 0){
                    query += `&manufacturerSku=${manufacturer_sku}`;
                }
            }
        };
    //add papaparse to page
        if (document.getElementById('Parser')){console.log('Ready');}else{
            let PapaParse = document.createElement('script');
            PapaParse.id = 'Parser',
            PapaParse.setAttribute('src','https://cdn.jsdelivr.net/gh/mholt/PapaParse/papaparse.min.js'),
            document.head.appendChild(PapaParse);
        }
    // create tool_box - tool_wrapper with close
        div_wrap = document.createElement('div'),
        div_wrap.setAttribute('style','position: fixed!important;z-index: 9999999!important;background-color: rgba(0,0,0,0.6)!important;top: 0!important;bottom: 0!important;left: 0!important;right: 0!important;height: 100vh!important;'),
        div_wrap.onclick = function(){document.body.removeChild(div_wrap);};
        div = document.createElement('div'),
        div.onclick = function(evt){evt.stopPropagation();},
        div.id = 'types';
        document.onkeyup = function(ev){ev=ev||window.event; if(ev.keyCode == 27){document.body.removeChild(div_wrap);}};
    // ------------------- info
        check = document.createElement('input'),
        check.id = 'fasthands',
        check.type = 'checkbox',
        div.appendChild(check);
        check.insertAdjacentHTML('afterend',
        '<p style="margin:0;color:lightpink">-------------------</br>What\'s new: </p><ul style="margin:0;color:lightpink;"><li>Vendor contact data,</li><li>matrix attributes,</li><li>notes export,</li><li>filter on either SKU (will navigate to item if unique sku)</li></ul>'),
        check.insertAdjacentHTML('afterend',
        '<p style="margin:0;color:lightpink;">Faster mode? (does not have an automatic download, copy data from the dev console)</p>'),
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
    //function to select export | add new here
    function n_(x){
		function add_link_(info_message){
			a = document.createElement("button"),
			a.setAttribute('style','border-radius:5px;border:0px;margin:0.2em;'),
			a.innerHTML = x;
			a.onmouseover = function(event){
				document.body.insertAdjacentHTML('beforeEnd',`<p style="margin: 0; padding: 0.3em; width: 20em; border-radius: 5px; position:absolute; top: ${event.clientY - 5}px; left: ${event.clientX + 5}px; background: white; z-index:99999999;" id="info">${info_message}</p>`);
			};
			a.onmouseout = function(){
				document.getElementById('info').remove();
			};
		};
        switch (x) {
            case 'ItemTags':
				info_message = "This exports: all tags of an item separated by commas";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'ItemTags';
                    APIendpoint = 'Item';
                    relation = '"TagRelations.Tag"';
                    query_();
                    data_();
                },
                tr_items.appendChild(a);
                break;
            case 'VendorIDs':
				info_message = "This exports: all vendorID's of an item separated by commas";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'VendorIDs';
                    APIendpoint = 'Item';
                    relation = '"ItemVendorNums"';
                    query_();
                    data_();
                };
                tr_items.appendChild(a);
                break;
            case 'ItemImages':
				info_message = "This exports: all items with their images";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'ItemImages';
                    APIendpoint = 'Item';
                    relation = '"Images"';
                    query_();
                    data_();
                };
                tr_items.appendChild(a);
                break;
            case 'Attributes':
				info_message = "This exports: all items with their attribute sets & attributes separated";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'Attributes';
                    APIendpoint = 'Item';
                    relation = '"ItemAttributes.ItemAttributeSet"';
                    query_();
                    data_();
                };
                tr_items.appendChild(a);
                break;
            case 'Notes':
				info_message = "This exports: all items with their note";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'Notes';
                    APIendpoint = 'Item';
                    relation = '"Note"';
                    query_();
                    data_();
                };
                tr_items.appendChild(a);
                break;
            case 'Items on order':
				info_message = "This exports: all the items and how much inventory is in a PO per location";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'Items on order';
                    APIendpoint = 'Item';
                    relation = '"ItemShops"';
                    query_();
                    data_();
                };
                tr_items.appendChild(a);
                break;
            case 'archived&published':
				info_message = "This exports: all the items that are both archived and still published to eCom";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'archived&published';
                    APIendpoint = 'Item';
                    query = '&archived=only&publishToEcom=true';
                    data_();
                },
                tr_items.appendChild(a);
				break;
			case 'customfields':
				info_message = "This exports: item custom fields";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'customfields';
                    APIendpoint = 'Item';
                    relation = '"CustomFieldValues"';
                    query_();
                    data_();
                },
                tr_items.appendChild(a);
				break;
            case 'tags_vendorids':
				info_message = "This exports: tags & vendorid's";
				add_link_(info_message);
                a.id = 'UniekMode',
                a.style.display = 'none',
                a.onclick = function(){
                    report = 'tags_vendorids';
                    APIendpoint = 'Item';
                    relation = '"TagRelations.Tag","ItemVendorNums"';
                    query_();
                    data_();
                },
                tr_items.appendChild(a);
                break;
            case 'Customertags':
				info_message = "This exports: customers and their tags";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'Customertags';
                    APIendpoint = 'Customer';
                    relation = '"Tags"';
                    //query += '&archive=1'
                    data_();
                };
                tr_customers.appendChild(a);
				break;
			case 'Customerfield':
				info_message = "This exports: customers and their custom fields";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'Customertags';
                    APIendpoint = 'Customer';
                    relation = '"CustomFieldValues"';
                    query += '&archive=1'
                    data_();
                };
                tr_customers.appendChild(a);
				break;
            case 'Vendors':
				info_message = "This exports: vendors and their contact info";
				add_link_(info_message);
                a.onclick = function(){
                    report = 'Vendors';
                    APIendpoint = 'Vendor';
                    relation = '"Contact"';
                    data_();
                };
                tr_reports.appendChild(a);
                break;
            case 'OrderNumbers':
				info_message = "This exports: all of the orders that have been synced from eCom to retail";
				add_link_(info_message);
                a.onclick = function(){
                    let startdate = window.prompt('Enter a start date? (YYYY-MM-DD format) Leave empty for all sales (heavy function)','');
                    if (startdate.length > 0){
                        let enddate = window.prompt('Want an end date too? Leave empty for "until now" (YYYY-MM-DD format)','');
                    }
                    report = 'OrderNumbers';
                    APIendpoint = 'Sale';
                    query = '&referenceNumber=>,0';
                    if (startdate.length > 0){
                        query += `&timeStamp=>,${startdate}`;
                    } else if (startdate.length && enddate.length > 0){
                        query += `&timeStamp=><,${startdate},${enddate}`;
                    }
                    data_();
                },
                tr_reports.appendChild(a);
                break;
            default:
                alert('didn\'t work');
                break;
        }
    }
    //add new here
    n_('ItemTags');
    n_('VendorIDs');
    //n_('ItemImages');
    n_('Attributes');
    n_('Notes');
    n_('Items on order');
	n_('Customertags');
	n_('Customerfield');
	n_('archived&published');
	n_('customfields');
    n_('tags_vendorids');
    n_('Vendors');
    n_('OrderNumbers');
    //main loop + callbacks to xml & dl
    function data_(){
        var attr = "@attributes";
        var url = `https://${domain}/API/Account/${rad_id}/${APIendpoint}.json?offset=0&limit=5`;
        if (relation.length > 0) {
            url += `&load_relations=[${relation}]`;
        }
        if (query.length > 0) {
            url += query;
        }
        var uri = encodeURI(url);
        var e = new XMLHttpRequest();
        e.open("GET", uri, false),
        e.onload = function(){
            if ( e.status >= 200 && e.status < 400 ){
                var o = JSON.parse(e.responseText);
                maxPage = o[attr].count;
                ++maxPage;
                for (pagenr = 0; pagenr <= maxPage; pagenr += 100) {
						XML_();
                };
            }
        },
		e.send();
    }
    //xml request per page + run to unparse
    function XML_(){
        let url = `https://${domain}/API/Account/${rad_id}/${APIendpoint}.json?offset=${pagenr}`;
        if (relation.length > 0) {
            url += `&load_relations=[${relation}]`;
        }
        if (query.length > 0) {
            url += query;
        }
        console.log(url);
        let uri = encodeURI(url);
        let e = new XMLHttpRequest();
        e.open("GET", uri, document.getElementById('fasthands').checked),
        e.onload = function(){
            if ( e.status >= 200 && e.status < 400 ){
                t = JSON.parse(e.responseText);
                if (report === 'OrderNumbers') {
                    unparse_();
                } else {
                    parse_Data_();
                }
            }
        },
        e.send();
    }
    //edit json data items add new here
    function parse_Data_(){
        if (t[APIendpoint] && t[APIendpoint].length > 1){
            t[APIendpoint].forEach((line,index) => {
                switch (report) {
                    case 'ItemTags'://checked - OK
						line.Tag="";
						if(!line.Tags){
							line.Tag="";
						} else if (typeof line.Tags.tag=="string"){
							line.Tag=line.Tags.tag;
						} else {
							line.Tag=line.Tags.tag.join(',');
						}
						delete line.Tags
                        break;
                    case 'VendorIDs'://checked - OK
                        if(line.ItemVendorNums && line.ItemVendorNums.ItemVendorNum.length > 0){
                            let l = "";
                            line.ItemVendorNums.ItemVendorNum.forEach((vendornum) => {
                                l += vendornum.value;
                                l += ','; l.slice(0,l.length - 1);
                            });
                            line.ItemVendorNums = l.slice(0,l.length - 1);
                        } else if (line.ItemVendorNums){
                            line.ItemVendorNums = line.ItemVendorNums.ItemVendorNum.value
                        } else {
                            line.ItemVendorNums = "";
                        }
                        break;
                    case 'ItemImages':// needs work
						delete line.Prices;
						for (index = 0; index < 12; ++index) {
							let placeImage='Image'+index;
							let placeName='Image_name'+index;
							line[placeImage]="";
							line[placeName]="";
						  };
						if (line.Images){
							if (line.Images.Image.length > 1){
								line.Images.Image.forEach((img,i) => {
									let newImage = 'Image'+i;
									let newName = 'Image_name'+i;
									line[newImage] = img.baseImageURL+img.publicID+'.png';
									line[newName] = img.filename;
								});
							} else {
								line.Image0 = line.Images.Image.baseImageURL + line.Images.Image.publicID + '.png';	
							}
						}
						delete line.Images;
						break;
                    case 'Attributes'://checked - OK - needs work on the replace
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
                    case 'Notes': //Checked - OK
						line.Notes = "";
						line.note_public="";
                        if (line.Note) {
							line.Notes = line.Note.note;
							line.note_public = line.Note.isPublic;
						}
						delete line.Note;
                        break;
                    case 'Items on order'://checked - OK
                        line.ItemShops.ItemShop.forEach((shop)=>{
                            if(shop.shopID == 0){
                                line['total items on order'] = shop.backorder;
                            } else {
                                line['items on order in shop '+shop.shopID] = shop.backorder;
                            }
                        })
                        delete line.ItemShops;
                        break;
                    case 'Customertags': // needs work in bigger accounts
                        line.birth_date = "";
                        if (line.dob && line.dob > 0) {
                            line.birth_date += line.dob;
                        }
                        line.customertags = "";
                        if(line.Tags && line.Tags.Tag.length > 0){
                            let l = "";
                            line.Tags.Tag.forEach((ctag) => {
                                l += ctag.name;
                                l += ','; l.slice(0,l.length - 1);
                            });
                            line.customertags = l.slice(0,l.length - 1);
                        } else if (line.Tags){
                            line.customertags = line.Tags.Tag.name;
                        }
                        delete line.dob;
                        delete line.Tags;
						break;
					case 'Customerfield':
						break;
                    case 'tags_vendorids': //checked - OK
						line.Tag = "";
						if(!line.Tags){
							line.Tag="";
						} else if (typeof line.Tags.tag=="string"){
							line.Tag=line.Tags.tag;
						} else {
							line.Tags.tag.forEach((tag,i)=>{
								line.Tag+=(tag)+(i<this.length-1?',':'');
							})
						}
						delete line.Tags
                        line.VendorNums = "";
                        if(line.ItemVendorNums && line.ItemVendorNums.ItemVendorNum.length > 0){
                            let l = "";
                            line.ItemVendorNums.ItemVendorNum.forEach((vendornum) => {
                                l += vendornum.value;
                                l += ','; l.slice(0,l.length - 1);
                            });
                            line.VendorNums = l.slice(0,l.length - 1);
                        } else if (line.ItemVendorNums){
                            line.VendorNums = line.ItemVendorNums.ItemVendorNum.value;
                        }
                        delete line.ItemVendorNums;
						break;
					case 'customfields':
						delete line.Prices;
						if(line.CustomFieldValues ){//&& line.CustomFieldValues.CustomFieldValue.length > 0) {
							console.log(line);
							line.CustomFieldValues.CustomFieldValue.forEach((field,i)=>{
								let l;
								switch (field.type){
									case 'string':
										field.value ? l = field.value : l = "";
										break;
									case 'single_choice':
										field.value.name ? l = field.value.name : l = "";
										break;
									case 'date':
										field.value ? l = field.value : l = "";
										break;
									case 'multi_choice':
										field.value.name ? l += field.value.name : l = "";
										break;
									case 'float':
										field.value ? l = field.value : l = "";
										break;
									case 'boolean':
										field.value ? l = field.value : l = "";
										break;
									default:
										break;
								};
								line["customfield"+i] = l;
							})
						}
						delete line.CustomFieldValues;
						break;
                    case 'Vendors': // checken - OK
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
                if (line.discountable){delete line.discountable;}
                if (line.tax){delete line.tax;}
                if (line.serialized){delete line.serialized;}
                if (line.modelYear){delete line.modelYear;}
                if (line.timeStamp){delete line.timeStamp;}
                if (line.categoryID){delete line.categoryID;}
                if (line.taxClassID){delete line.taxClassID;}
                if (line.departmentID){delete line.departmentID;}
                if (line.itemMatrixID){delete line.itemMatrixID;}
                if (line.manufacturerID){delete line.manufacturerID;}
                if (line.seasonID){delete line.seasonID;}
                if (line.defaultVendorID){delete line.defaultVendorID;}
                if (line.Prices) {
                    line.Prices.ItemPrice.forEach( (price) => {
                        line[price.useType] = price.amount;
                    });
                    delete line.Prices;
                }
                line.delete_columns_to_right = "";
            });
            unparse_();
        } else if (t[APIendpoint] && t[APIendpoint].length == 1){
            window.alert('SKU only has one item, opening in new page (check browser popup blocker)');
            let url = `https://${domain}/?name=item.views.item&form_name=view&tab=details&id=`+t.Item.itemID;
            console.log(t);
            window.open(url,'_blank');
        } else {window.alert('SKU not found');}
    }
    //papaparse data
    function unparse_(){
        csv += Papa.unparse(t[APIendpoint],{
            header: true,
            delimiter: ";",
        });
        console.log(report);
        console.log(t);
		console.log(csv.length+` characters in csv | items: ${pagenr}/${maxPage} | ` + ((pagenr/maxPage)*100) + '%');
        if(pagenr + 100 >= maxPage){
            console.log(csv);
            document.getElementById('fasthands').checked ? "" : setTimeout(DL_, 2 * 1000);
            document.getElementById('progressbar').innerHTML = 'Progress: 100%';
            document.getElementById('progressbar').style.width = '100%';
        }
	}
	function progressbar_(){
		console.log('endProgress: '+ ((pagenr/maxPage)*100) + '%');
		document.getElementById('progressbar').innerHTML = 'Progress: '+ ((pagenr/maxPage)*100) + '%';
		document.getElementById('progressbar').style.width = ((pagenr/maxPage)*100) + '%';
	};
	//window.setInterval(progressbar_(), 500);
	//progressbar_();
    //download button
    function DL_(){
        var today = new Date();
        var blob = new Blob([csv]);
        var file = document.createElement('a');
        file.href = window.URL.createObjectURL(blob, {type: "text/plain"}),
        file.download = today.toString().replace(/ /g,"_")+' '+APIendpoint+'_export.csv',
        file.click();
    }
}();