let body = {
    "IntegrationAttributes": {
        "IntegrationAttribute": [{
                "key": "shop_id",
                "value": "1"
            },
            {
                "key": "employee_id",
                "value": "2"
            },
            {
                "key": "user_id",
                "value": "565094"
            },
            {
                "key": "register_id",
                "value": "2"
            },
            {
                "key": "shipping_item_id",
                "value": "1"
            },
            {
                "key": "payment_item_id",
                "value": "2"
            },
            {
                "key": "language_code",
                "value": "en_US"
            },
            {
                "key": "main_domain",
                "value": "rubenvan-heeatlightspeedhqcom.webshopapp.com"
            },
            {
                "key": "dataload_progress_percentage",
                "value": "100"
            }
        ]
    }
}
const baseURL = 'https://us.merchantos.com/';
const endpoint = "API/Account/173696/Integration/1/IntegrationAttribute.json";
let res = await fetch(`${baseURL}${endpoint}`, {
    method: "PUT",
    body: JSON.stringify(body)
});
let ans = await res.json();
console.log(ans)