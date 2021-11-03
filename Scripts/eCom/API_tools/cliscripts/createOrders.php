<?php

    include "../classes/header.php";
    $C = new CLIColors();

    echo $C->getColoredString('[START] Start generating orders', 'blue') . "\n";
    $C->getFlushed();

$ApiCluster     = Helper::getCLIAnswer('What is the API Cluster?');
$ApiKey         = Helper::getCLIAnswer('What is the API Key?');
$ApiSecret      = Helper::getCLIAnswer('What is the API Secret?');
$ApiLanguage    = Helper::getCLIAnswer('What is the API language?');

    $CheckoutParams = [
        "mode"             => "guest",
        "customer"         => [
            "firstname" => "Lucien",
            "lastname"  => "Lightspeed",
            "email"     => "lucien.versendaal@lightspeedhq.com",
            "phone"     => "0612345678",
            "gender"    => "male"
        ],
        'billing_address'  => [
            "name"        => "Lucien",
            "address1"    => "Herengracht",
            "number"      => 54,
            "extention"   => "",
            "zipcode"     => "1015BN",
            "city"        => "Amsterdam",
            "region"      => "Noord-Holland",
            "country"     => "nl",
            "sameaddress" => true
        ],
        "shipping_address" => [
            "name"      => "Lucien",
            "address1"  => "Herengracht",
            "number"    => 54,
            "extention" => "",
            "zipcode"   => "1015BN",
            "city"      => "Amsterdam",
            "region"    => "Noord-Holland",
            "country"   => "nl"
        ],
        "notifications"    => false,
        "memo"             => "Order from API"
    ];

    $products = [
        "variant_id" => 212625850,
        "quantity"   => 1
    ];

    $shipment = [
        "shipment_method" => [
            "id"    => "postnl|Brievenbuspakje",
            "title" => "Bezorgd in de brievenbus"
        ]
    ];

    $payment  = [
        "payment_method" => [
            "id"     => "paypal",
            "method" => "paypal",
            "data"   => [
                "issuer" => "paypal_TESTNL99"
            ]
        ]
    ];
    $ranNum   = rand(0, 100000);
    $discount = [
        "discount"      => 0,
        "isActive"      => true,
        "minumumAmount" => 0,
        "applyTo"       => "all",
        "endDate"       => "2021-01-01",
        "type"          => "price",
        "code"          => "freeshipping_" . $ranNum,
        "timesUsed"     => 0,
        "startDate"     => "2019-01-01",
        "shipment"      => "free",
        "usageLimit"    => 1
    ];

        try {
            $api = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);

            $createCheckout = $api->checkouts->create($CheckoutParams);
            $checkout       = $createCheckout['id'];
            echo $C->getColoredString("[INFO] Checkout created ID# $checkout", 'yellow') . "\n";
            var_dump($createCheckout);
            sleep(1);

            echo $C->getColoredString('Creating discount code!');
            $discounts = $api->discounts->create($discount);
            print_r($discounts);
            $discountID   = $discounts['id'];
            $discountName = $discounts['code'];
            echo $C->getColoredString("[INFO] Discount created! with ID# ->> $discountID Code# ->> $discountName",
                    'green') . "\n";
            sleep(1);

            echo $C->getColoredString('Adding Product!');
            $api->checkoutsProducts->create($checkout, $products);
            echo $C->getColoredString('[INFO] Product Added to checkout', 'yellow') . "\n";
            sleep(1);

            echo $C->getColoredString('Update checkout with payment, shipment and discount!');
            $api->checkouts->update($checkout, [
                "shipment_method" => [
                    "id" => "postnl|Brievenbuspakje"
                ],
                "payment_method"  => [
                    "id" => "paypal"
                ],
                "discount_code"   => "$discountName"
            ]);
            echo $C->getColoredString('[INFO] payment, shipment and discount added to checkout', 'yellow') . "\n";
            sleep(1);

            echo $C->getColoredString('Validating checkout!');
            $r = $api->checkoutsValidate->get($checkout);
            echo $C->getColoredString("[INFO] Checkout validated [RESULT]", 'yellow') . "\n";
            echo var_dump($r);
            sleep(1);

            echo $C->getColoredString('Convert to order!');
            $order = $api->checkoutsOrder->create($checkout, [
                "comment" => ""
            ]);
            echo $C->getColoredString('[INFO] Checkout converted', 'yellow') . "\n";
            sleep(1);

            echo $C->getColoredString('Delete discount code!');
            $discount   = $api->discounts->delete($discountID);
            $discountID = $discount['id'];
            echo $C->getColoredString("[INFO] Discount deleted! with ID# ->> $discountID", 'green') . "\n";
            sleep(3);

        } catch (Exception $e) {
            echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red') . "\n";
            echo $C->getColoredString('[ERROR]' . $e->getMessage() . $e->getFile() . $e->getLine(), 'red') . "\n";
        }