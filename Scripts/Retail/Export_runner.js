!function(){
    //define base url
        let domain = window.location.host;
        let rad_id = document.querySelector('#help_account_id > var').innerHTML;
        //rad_id = rad_id.replace(/[^0-9\.]+/g,"");
        let csv, APIendpoint, relation, query, pagenr, report, Params, maxPage; //variables for different functions
        csv = APIendpoint = relation = query = "";
    //add papaparse to page
        if (document.getElementById('Parser')){}else{
            let PapaParse = document.createElement('script');
            PapaParse.id = 'Parser',
            PapaParse.setAttribute('src','https://cdn.jsdelivr.net/gh/mholt/PapaParse/papaparse.min.js'),
            document.head.appendChild(PapaParse);
        }
    // create box
        div_wrap = document.createElement('div'),
        div_wrap.setAttribute('style','position: fixed!important;z-index: 9999999!important;background-color: rgba(0,0,0,0.6)!important;top: 0!important;bottom: 0!important;left: 0!important;right: 0!important;height: 100vh!important;'),
        div_wrap.onclick = function(){document.body.removeChild(div_wrap)},
        div = document.createElement('div'),
        div.id = 'types',
        p = document.createElement('p'), p.setAttribute('style','margin:0;color:white;'),
        p.innerHTML = 'New features: automatic download, matrix attributes',
        div.appendChild(p),
        div.setAttribute('style','position:fixed;top: 50%!important;left: 50%!important;transform:translate(-50%,-50%)!important;background-color:#999999;display:block;'),
        // -------------------
        div_wrap.appendChild(div),
        document.body.appendChild(div_wrap);
    //function to select export add new here
    function n(x){
        switch (x) {
            case 'ItemTags':
                Params = {
                    header: true,
                    delimiter: ";",
                };
                a = document.createElement("button"),
                a.innerHTML = 'ItemTags',
                a.onclick = function(){
                    report = 'ItemTags';
                    APIendpoint = 'Item';
                    relation = 'TagRelations.Tag';
                    data_();
                },
                div.appendChild(a);
                break;
            case 'VendorIDs':
                Params = {
                    header: true,
                    delimiter: ";",
                };
                a = document.createElement("button"),
                a.innerHTML = 'VendorIDs',
                a.onclick = function(){
                    report = 'VendorIDs';
                    APIendpoint = 'Item';
                    relation = 'ItemVendorNums';
                    data_();
                };
                div.appendChild(a);
                break;
            case 'ItemImages':
                Params = {
                    header: true,
                    delimiter: ";",
                };
                a = document.createElement("button"),
                a.innerHTML = 'ItemImages',
                a.onclick = function(){
                    report = 'ItemImages';
                    APIendpoint = 'Item';
                    relation = 'Images';
                    data_();
                };
                div.appendChild(a);
                break;
            case 'Attributes':
                Params = {

                };
                a = document.createElement("button"),
                a.innerHTML = 'Attributes (WIP)',
                a.onclick = function(){
                    report = 'Attributes';
                    APIendpoint = 'Item';
                    relation = 'ItemAttributes.ItemAttributeSet';
                    data_();
                };
                div.appendChild(a);
                break;
            case 'OrderNumbers':
                Params = {
                    header: true,
                    delimiter: ";",
                };
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
    n('Attributes')
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
        let url = `https://${domain}/API/Account/${rad_id}/${APIendpoint}.json?offset=${pagenr}&limit=100`;
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
                default:
                    break;
            }
            if (item.Prices) {
                item.Prices.ItemPrice.forEach( (price) => {
                    item[price.useType] = price.amount;
                });
                delete item.Prices;
            }
            item.placeholdernewline_delete = "";
        });
        unparse_();
    }
    //parse data
    function unparse_(){
        csv += Papa.unparse(t[APIendpoint],Params);
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
