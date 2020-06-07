javascript:!function(){
    let domain = window.location.host;
    let RAD = document.querySelector('#help_account_id > var').innerHTML;
    let settings = {
        APIendpoint : window.prompt('Which api endpoint?(case sensitive)','Item'),
        AddRelation : window.prompt('Any relations to load? Or leave empty','Images,Category'),
        ID : window.prompt('Specific id?',''),
    };
    settings.AddRelation = settings.AddRelation.replace(',','","');
    let query = "";
    if (settings.ID.length > 0 && settings.AddRelation.length > 0){
        query+=`/${settings.ID}.json?load_relations["${settings.AddRelation}"]`;
    } else if (settings.AddRelation.length > 0){
        query+=`.json?load_relations["${settings.AddRelation}"]`;
    } else if (settings.ID.length > 0){
        query+=`/${settings.ID}.json`;
    } else {
        query+='.json';
    }
    let baseurl = `https://${domain}/API/Account/${RAD}/${settings.APIendpoint}${query}`;
    console.log(baseurl);
    window.open(encodeURI(baseurl));
}();
