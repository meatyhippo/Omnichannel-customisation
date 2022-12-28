let sub_id = 2;
let body = `_token=Um3BGhd1L5L-g%5CJXIJi0s9h4%3DHwtGsspkQZtp3tBxkkIOkUsJZF%5CeD7dmwBKuf%3DySVsxJ%3Dj%3Dc4RBiQ4fF%5CP1B%3D9u&
status=5&
exit_reason=------------&
exit_description=&
expires_at=29-11-2022&
start_date_day=20&
start_date_month=12&
start_date_year=2022&
has_end_date=0&
end_date_month=12&
end_date_year=2023&
subscription_id=${sub_id}&
coupon_id=------------&
description=&
monthly_fee_amount=0%2C00&
template_fee_amount=0%2C00&
discount_template_price=0%2C00&
startup_fee_amount=0%2C00&
startup_fee_paid=0&
discount_price=0%2C00&
discount_price_paid=0%2C00&
seopay_subscription_id=------------&
commission_percentage=0%2C00%25&
commission_min_amount=0%2C00&
commission_max_amount=0%2C00&
is_invoice_in_advance=1&
bank_details_on_invoice=0&
show_payment_overdue_message=&
max_products=0&
max_user_accounts=0&
max_email_accounts=0&
max_email_forwards=0&
max_domain_names=0&
max_domain_forwards=0&
max_languages=7&
max_currencies=0&
has_template_editor=1&
has_translations=0&
has_copyright=1&
has_b2b=1&
has_multishop=0&
has_filters=1&
has_product_discounts=1&
has_blogs=1&
has_product_bundles=1&
has_content_editor=1&
has_discount_rules=1&
has_checkout_ab_testing=1`

fetch("https://seoshop.webshopapp.com/backoffice/admin-shops/edit_subscription.do?id=345181", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "accept-language": "en-GB,en;q=0.8",
    "cache-control": "max-age=0",
    "content-type": "application/x-www-form-urlencoded",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "sec-gpc": "1",
    "upgrade-insecure-requests": "1"
  },
  "body": body.replaceAll("\n", ""),
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});