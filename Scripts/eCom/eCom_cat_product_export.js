javascript:!function(){
    //define variables
    let domain = window.location.host;
    let cat_id = window.location.pathname.match(/\d+/);
    let page_limit = 50;
    let csv, pagenr, maxPage; //variables for different functions
    csv = "";

    //add papaparse to page
    if (document.getElementById('Parser')){console.log('Ready');}else{
        let PapaParse = document.createElement('script');
        PapaParse.id = 'Parser',
        PapaParse.setAttribute('src','https://cdn.jsdelivr.net/gh/mholt/PapaParse/papaparse.min.js'),
        document.head.appendChild(PapaParse);
    }
    function get_maxPage(){
        let url = `https://${domain}/admin/categories/${cat_id}/products.json?limit=${page_limit}`;
        let uri = encodeURI(url);
        let e = new XMLHttpRequest();
        e.open("GET", uri, true),
        e.onload = function(){
            if ( e.status >= 200 && e.status < 400 ){
                t = JSON.parse(e.responseText);
                maxPage = t.links.pages;
                data_();
            }
        },
        e.send();
    }
    //main loop + callbacks to xml & dl
    function data_(){
        for (pagenr = 0; pagenr < maxPage; pagenr += 1) {
            function XML_(){
                let url = `https://${domain}/admin/categories/${cat_id}/products.json?limit=${page_limit}&page=${pagenr}`;
                console.log(url);
                let uri = encodeURI(url);
                let e = new XMLHttpRequest();
                e.open("GET", uri, false),
                e.onload = function(){
                    if ( e.status >= 200 && e.status < 400 ){
                        t = JSON.parse(e.responseText);
                        t.data.forEach(item => {
							if (item.product.barcode.length == 0){
								item.EANbarcode = "";
							} else {
								item.EANbarcode = item.product.barcode;
							};
							if (item.product.sku.length == 0){
								item.manufacturersku = "";
							} else {
								item.manufacturersku = item.product.sku;
							};
							if (item.product.article_code.length == 0){
								item.customsku = "";
							} else {
								item.customsku = item.product.article_code;
							};
							if (item.product.brand == null){
								item.brandname = "";
							} else {
								item.brandname = item.product.brand.title;
							};
							item.name = "";
							if (item.product.i18n.nl){
                                item.name = item.product.i18n.nl.title;
                            } else if (item.product.i18n.en) {
                                item.name = item.product.i18n.en.title;
                            };
                            delete item.id;
                            delete item.product;
							delete item.position;
							item.delete_to_my_right
                        });
                        unparse_();
                    }
                },
                e.send();
            }
            XML_();
        };
    }

    //papaparse data
    function unparse_(){
        csv += Papa.unparse(t.data,{
            header: true,
            delimiter: ";",
        });
        console.log(csv.length+` characters in csv | page: ${pagenr}/${maxPage} | ` + ((pagenr/maxPage)*100) + '%');
        if(pagenr + 1 >= maxPage){
            console.log(csv);
            setTimeout(DL_, 2 * 1000);
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
    get_maxPage();
}();