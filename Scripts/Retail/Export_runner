!function(){
    //define base url
        let domain = window.location.host;
        let rad_id = document.getElementById('help_account_id').innerHTML;
        rad_id = rad_id.replace(/[^0-9\.]+/g,"");
        let csv, APIendpoint, relation, query, pagenr, report; //variables for different functions
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
        div.setAttribute('style','position:fixed;top: 50%!important;left: 50%!important;transform:translate(-50%,-50%)!important;background-color:#999999;display:block;'),
        // -------------------
        div_wrap.appendChild(div),
        document.body.appendChild(div_wrap);
    //function to select export
    function n(x){
        switch (x) {
            case 'ItemTags':
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
    n('ItemTags');
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
        e.open("GET", uri, true),
        e.onload = function(){
            if ( e.status >= 200 && e.status < 400 ){
                var o = JSON.parse(e.responseText);
                var maxPage = o[attr].count;
                ++maxPage;
                for (pagenr = 0; pagenr < maxPage; pagenr += 100) {
                    setInterval(
                        XML_(),
                        2 * 1000
                      );
                };
                //var promise = new Promise(function(resolve, reject){
                //    if(pagenr = maxPage){
                //            resolve(DL_());
                //    }
                //})
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
        console.log(report);
        let uri = encodeURI(url);
        let e = new XMLHttpRequest();
        e.open("GET", uri, true),
        e.onload = function(){
            if ( e.status >= 200 && e.status < 400 ){
                t = JSON.parse(e.responseText);
                console.log(t);
                    switch (report) {
                        case 'ItemTags':
                            !function(){
                                t.Item.forEach((element,index) => {
                                    if (t.Item[index].Tags) {
                                        let l = JSON.stringify(t.Item[index].Tags.tag);
                                        t.Item[index].Tags = l;
                                    }
                                });
                                unparse_();
                            }();
                            break;
                        case 'OrderNumbers':
                            unparse_();
                            break;                        
                        default:
                            console.log(report);
                            break;
                    }
            }
        },
        e.send();
    }
    //parse data
    function unparse_(){
        csv += Papa.unparse(t[APIendpoint], {
            header: true,
            delimiter: ";",
        });
        console.log(csv.length);
        console.log(csv);
    }
    //download button
    async function DL_(){
        var hiddenElement = document.createElement('a');
        var today = new Date();
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv),
        hiddenElement.download = today.toString().replace(/ /g,"_")+'_export.csv',
        hiddenElement.click();
    }
    }();
