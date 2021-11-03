var lowest_dupe_cat = 10062478;
if (lowest_dupe_cat && lowest_dupe_cat.length > 0){
var main_cat = $('#table_category_7153859 > div > table > tbody > tr > td > div > input');
for (i = 0; i < main_cat.length; ++i) {
    if (main_cat[i].getAttribute('value')>=lowest_dupe_cat) {
    main_cat[i].click();
    }
};}

// -------------------
javascript:!function(){
    var cat_name = window.prompt('What is the exact name of the category?(case sensitive)','');
    var lowest_dupe_cat = 10062470;
    var all_cat = $('#table_category_7153859 > div > table > tbody[class*="-"] > tr');
    for (i = 0; i < all_cat.length; ++i) {
        var input = $('#'+all_cat[i].id+'> td.check > div > input');
        var name = all_cat[i].querySelector('td.name div a').innerHTML;
    console.log(input[0].getAttribute('value'));
    console.log(name);
        if (input[0].getAttribute('value')>=lowest_dupe_cat && name == cat_name) {
            input.click();
        }};
    }();