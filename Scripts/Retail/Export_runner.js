!function(){
    //define variables
        document.addEventListener
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
    // create box
        div_wrap = document.createElement('div'),
        div_wrap.setAttribute('style','position: fixed!important;z-index: 9999999!important;background-color: rgba(0,0,0,0.6)!important;top: 0!important;bottom: 0!important;left: 0!important;right: 0!important;height: 100vh!important;'),
        div_wrap.onclick = function(){document.body.removeChild(div_wrap);},
        div = document.createElement('div'),
        div.id = 'types';
        document.onkeyup = function(ev){ev=ev||window.event; if(ev.keyCode == 27){document.body.removeChild(div_wrap);}};
        // -------------------
        p = document.createElement('p'), p.setAttribute('style','margin:0;color:lightpink;'),
        p.innerHTML = 'New features: <ul style="margin:0;"><li>automatic download,</li><li>matrix attributes,</li><li>notes export,</li><li>filter on either SKU (will navigate to item if unique sku)</li></ul>',
        div.appendChild(p),
        div.setAttribute('style','position:fixed;top: 50%!important;left: 50%!important;transform:translate(-50%,-50%)!important;background-color:#999999;display:block;'),
        // -------------------
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
                    relation = 'TagRelations.Tag';
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
                    relation = 'ItemVendorNums';
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
                    relation = 'Images';
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
                    relation = 'ItemAttributes.ItemAttributeSet';
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
                    relation = 'Note';
                    query_();
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
    n('OrderNumbers');
    //main function + callbacks to xml & dl
    function data_(){
        var attr = "@attributes";
        var url = `https://${domain}/API/Account/${rad_id}/${APIendpoint}.json?offset=0&limit=5`;
        if (relation.length > 0) {
            url += `&load_relations=["${relation}"]`;
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
    //xml request + callback to unparse
    function XML_(){
        let url = `https://${domain}/API/Account/${rad_id}/${APIendpoint}.json?offset=${pagenr}`;
        if (relation.length > 0) {
            url += `&load_relations=["${relation}"]`;
        }
        if (query.length > 0) {
            url += query;
        }
        console.log(url);
        let uri = encodeURI(url);
        let e = new XMLHttpRequest();
        e.open("GET", uri, false),
        e.onload = function(){
            if ( e.status >= 200 && e.status < 400 ){
                t = JSON.parse(e.responseText);
                if (report === 'OrderNumbers') {
                    unparse_();
                } else {
                    data_Parse_Item();
                }
            }
        },
        e.send();
    }
    //edit json data items add new here
    function data_Parse_Item(){
        if (t.Item.length > 1){
        t.Item.forEach((item,index) => {
            switch (report) {
                case 'ItemTags':
                    if (item.Tags) {
                        let l = JSON.stringify(item.Tags.tag);
                        item.Tags = l.replace(/(\[)|(\])|(\")/gi,'');
                    } else {
                        item.Tags = "";
                    }
                    break;
                case 'VendorIDs':
                    if(item.ItemVendorNums && item.ItemVendorNums.ItemVendorNum.length > 0){
                        let l = "";
                        item.ItemVendorNums.ItemVendorNum.forEach((vendornum) => {
                            l += vendornum.value;
                            l += ','; l.slice(0,l.length - 1);
                        });
                        item.ItemVendorNums = l.slice(0,l.length - 1);
                    } else if (item.ItemVendorNums){
                        item.ItemVendorNums = item.ItemVendorNums.ItemVendorNum.value
                    } else {
                        item.ItemVendorNums = "";
                    }
                    break;
                case 'ItemImages':
                    delete item.Prices;
                    if (item.Images && item.Images.Image.length > 0) {
                        item.Images.Image.forEach((img,i) => {
                            let newImage = 'Image'+i;
                            item[newImage] = img.baseImageURL+img.publicID+'.png';
                        });
                        item.Images = "";
                    } else if (item.Images) {
                        item.Image0 = item.Images.Image.baseImageURL + item.Images.Image.baseImageURL.publicID + '.png';
                    } else {
                        item.Image0 = "";
                    }
                    break;
                case 'Attributes':
                    delete item.Prices;
                    item.Attribute1 = "";
                    item.Attribute2 = "";
                    item.Attribute3 = "";
                    item.ItemAttributeSet = "";
                    if (item.ItemAttributes) {
                        item.description =  item.description.replace(item.ItemAttributes.attribute1,"").replace(item.ItemAttributes.attribute2,"").replace(item.ItemAttributes.attribute3,"").trim();
                        item.ItemAttributeSet = item.ItemAttributes.ItemAttributeSet.name;
                        if (item.ItemAttributes.attribute1 == "") {
                            item.Attribute1 = item.ItemAttributes.attribute2;
                            item.Attribute2 = "";
                            item.Attribute3 = "";
                        } else {
                            item.Attribute1 = item.ItemAttributes.attribute1;
                            item.Attribute2 = item.ItemAttributes.attribute2 == "" ? "" : item.ItemAttributes.attribute2;
                            item.Attribute3 = item.ItemAttributes.attribute3 == "" ? "" : item.ItemAttributes.attribute3;
                        };
                    }
                    delete item.ItemAttributes;
                    break;
                case 'Notes':
                    if (item.Note) {
                        let l = JSON.stringify(item.Note.note);
                        item.Note = l.replace('\\n',' ').replace('"','');
                    } else {
                        item.Note = "";
                    }
                    break;
                default:
                    break;
            }
            delete item.discountable;
            delete item.tax;
            delete item.archived;
            delete item.itemType;
            delete item.serialized;
            delete item.modelYear;
            delete item.timeStamp;
            delete item.categoryID;
            delete item.taxClassID;
            delete item.departmentID;
            delete item.itemMatrixID;
            delete item.manufacturerID;
            delete item.seasonID;
            delete item.defaultVendorID;
            if (item.Prices) {
                item.Prices.ItemPrice.forEach( (price) => {
                    item[price.useType] = price.amount;
                });
                delete item.Prices;
            }
            item.delete_columns_to_right = "";
        });
        unparse_();
        } else if (t.Item.length == 1){
            window.alert('SKU only has one item, opening in new page (check browser popup blocker)');
            let url = `https://${domain}/?name=item.views.item&form_name=view&tab=details&id=`+t.Item.itemID;
            console.log(t);
            window.open(url,'_blank');
        } else {window.alert('SKU not found');}
    }
    //parse data
    function unparse_(){
        csv += Papa.unparse(t[APIendpoint],{
            header: true,
            delimiter: ";",
        });
        console.log(report);
        console.log(t);
        console.log(csv.length+` characters in csv | page: ${pagenr}/${maxPage}`);
        if(pagenr + 100 >= maxPage){
            console.log(csv);
            setTimeout(
                DL_, 2 * 1000
            );
        }
    }
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
