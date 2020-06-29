!function(){
    //define variables
        let domain = window.location.host;
        let rad_id = document.querySelector('#help_account_id > var').innerHTML;
        let csv, APIendpoint, relation, query, pagenr, report, manufacturer_sku, maxPage; //variables for different functions
        csv = APIendpoint = relation = query = "";
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
    // create box - wrapper with close
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
        '<p style="margin:0;color:lightpink;">Check box for fast mode (does not have an automatic download, copy data from the dev console)</p>'),
        div.setAttribute('style','position:fixed;top: 50%!important;left: 50%!important;transform:translate(-50%,-50%)!important;background-color:#999999;display:block;');
        // ------------------- progress bar
        bar = document.createElement('div'),
        bar.setAttribute('style','margin:0;height:20px;background-color:lightpink;color:white;'),
        bar.style.width = '1%',
        bar.id = 'progressbar';
        div.appendChild(bar);
        // ------------------- append all to body
        div_wrap.appendChild(div),
        document.body.appendChild(div_wrap);
    //function to select export | add new here
    function n(x){
        switch (x) {
            case 'ItemTags':
                a = document.createElement("button"),
                a.innerHTML = 'ItemTags',
                a.onclick = function(){
                    report = 'ItemTags';
                    APIendpoint = 'Item';
                    relation = '"TagRelations.Tag"';
                    query_();
                    data_();
                },
                div.appendChild(a);
                break;
            case 'VendorIDs':
                a = document.createElement("button"),
                a.innerHTML = 'VendorIDs',
                a.onclick = function(){
                    report = 'VendorIDs';
                    APIendpoint = 'Item';
                    relation = '"ItemVendorNums"';
                    query_();
                    data_();
                };
                div.appendChild(a);
                break;
            case 'ItemImages':
                a = document.createElement("button"),
                a.innerHTML = 'ItemImages',
                a.onclick = function(){
                    report = 'ItemImages';
                    APIendpoint = 'Item';
                    relation = '"Images"';
                    query_();
                    data_();
                };
                div.appendChild(a);
                break;
            case 'Attributes':
                a = document.createElement("button"),
                a.innerHTML = 'Attributes',
                a.onclick = function(){
                    report = 'Attributes';
                    APIendpoint = 'Item';
                    relation = '"ItemAttributes.ItemAttributeSet"';
                    query_();
                    data_();
                };
                div.appendChild(a);
                break;
            case 'Notes':
                a = document.createElement("button"),
                a.innerHTML = 'Notes',
                a.onclick = function(){
                    report = 'Notes';
                    APIendpoint = 'Item';
                    relation = '"Note"';
                    query_();
                    data_();
                };
                div.appendChild(a);
                break;
            case 'Items on order':
                a = document.createElement("button"),
                a.innerHTML = 'Items on order',
                a.onclick = function(){
                    report = 'Items on order';
                    APIendpoint = 'Item';
                    relation = '"ItemShops"';
                    query_();
                    data_();
                };
                div.appendChild(a);
                break;
            case 'UniekMode':
                a = document.createElement("button"),
                a.innerHTML = 'UniekMode',
                a.id = 'UniekMode',
                a.style.display = 'none',
                a.onclick = function(){
                    report = 'UniekMode';
                    APIendpoint = 'Item';
                    relation = '"TagRelations.Tag","ItemVendorNums"';
                    data_();
                },
                div.appendChild(a);
                break;
            case 'Customers':
                a = document.createElement("button"),
                a.innerHTML = 'Customers Tags',
                a.onclick = function(){
                    report = 'Customers';
                    APIendpoint = 'Customer';
                    relation = '"Tags"';
                    data_();
                };
                div.appendChild(a);
                break;
            case 'Vendors':
                a = document.createElement("button"),
                a.innerHTML = 'Vendor Contact',
                a.onclick = function(){
                    report = 'Vendors';
                    APIendpoint = 'Vendor';
                    relation = '"Contact"';
                    data_();
                };
                div.appendChild(a);
                break;
            case 'OrderNumbers':
                a = document.createElement("button"),
                a.innerHTML = 'OrderNumbers',
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
                div.appendChild(a);
                break;
            default:
                alert('didn\'t work');
                break;
        }
    }
    //add new here
    n('ItemTags');
    n('VendorIDs');
    //n('ItemImages');
    n('Attributes');
    n('Notes');
    n('Items on order');
    n('Customers');
    n('UniekMode');
    n('Vendors');
    n('OrderNumbers');
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
                for (pagenr = 0; pagenr < maxPage; pagenr += 100) {
                    setInterval(
                        XML_(), 1 * 1000
                    );
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
                    case 'ItemTags':
                        if (line.Tags) {
                            let l = JSON.stringify(line.Tags.tag);
                            line.Tags = l.replace(/(\[)|(\])|(\")/gi,'');
                        } else {
                            line.Tags = "";
                        }
                        break;
                    case 'VendorIDs':
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
                    case 'ItemImages':
                        delete line.Prices;
                        if (line.Images && line.Images.Image.length > 0) {
                            line.Images.Image.forEach((img,i) => {
                                let newImage = 'Image'+i;
                                line[newImage] = img.baseImageURL+img.publicID+'.png';
                            });
                            line.Images = "";
                        } else if (line.Images) {
                            line.Image0 = line.Images.Image.baseImageURL + line.Images.Image.baseImageURL.publicID + '.png';
                        } else {
                            line.Image0 = "";
                        }
                        break;
                    case 'Attributes':
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
                    case 'Notes':
                        line.Note = "";
                        if (line.Note) {
                            let l = JSON.stringify(line.Note.note);
                            line.Note = l.replace('\\n',' ').replace('"','');
                        }
                        break;
                    case 'Items on order':
                        line.ItemShops.ItemShop.forEach((shop)=>{
                            if(shop.shopID == 0){
                                line['total items on order'] = shop.backorder;
                            } else {
                                line['items on order in shop '+shop.shopID] = shop.backorder;
                            }
                        })
                        delete line.ItemShops;
                        break;
                    case 'Customers':
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
                        delete line.Tags;
                        break;
                    case 'UniekMode':
                        line.itemTags = "";
                        if (line.Tags) {
                            let l = JSON.stringify(line.Tags.tag);
                            line.itemTags = l.replace(/(\[)|(\])|(\")/gi,'');
                        }
                        delete line.Tags;
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
                    case 'Vendors':
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
                if (line.archived){delete line.archived;}
                if (line.itemType){delete line.itemType;}
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
        } else if (t.Item && t.Item.length == 1){
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
        console.log(csv.length+` characters in csv | page: ${pagenr}/${maxPage} | ` + ((pagenr/maxPage)*100) + '%');
        if(pagenr + 100 >= maxPage){
            console.log(csv);
            document.getElementById('fasthands').checked ? "" : setTimeout(DL_, 2 * 1000);
            document.getElementById('progressbar').innerHTML = 'Progress: '+ 100 + '%';
            document.getElementById('progressbar').style.width = 100 + '%';
        }
    }
    function progressbar_(){
        document.getElementById('progressbar').innerHTML = 'Progress: '+ ((pagenr/maxPage)*100) + '%';
        document.getElementById('progressbar').style.width = ((pagenr/maxPage)*100) + '%';
        if(pagenr + 100 <= maxPage){
            window.requestAnimationFrame(progressbar_);
        }
    }
    window.requestAnimationFrame(progressbar_);
    //download button
    function DL_(){
        var today = new Date();
        var blob = new Blob([csv]);
        var file = document.createElement('a');
        file.href = window.URL.createObjectURL(blob, {type: "text/plain"}),
        file.download = today.toString().replace(/ /g,"_")+'_export.csv',
        file.click();
    }
}();
