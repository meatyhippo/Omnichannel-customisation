<?php

use Google\Cloud\Translate\V2\TranslateClient;

/** Uncomment and populate these variables in your code */
$text = 'The text to translate.';
$targetLanguage = 'nl';  // Language to translate to

$translate = new TranslateClient();
$result = $translate->translate($text, [
    'target' => $targetLanguage,
]);
print("Source language: $result[source]\n");
print("Translation: $result[text]\n");