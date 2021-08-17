<?php

include "../classes/header.php";

$PageLimit              = 250;
$ApiRequestsCount       = 1;
$currentUser = get_current_user();

$C = new CLIColors();
echo $C->getColoredString('[START] Getting Blog articles.', 'blue')."\n";

$API['cluster']          = Helper::getCLIAnswer('What is the API Cluster?');
$API['apiKey']           = Helper::getCLIAnswer('What is the API Key?');
$API['apiSecret']        = Helper::getCLIAnswer('What is the API Secret?');
$API['apiLanguage']      = Helper::getCLIAnswer('What is the API language?');

$FilePath       = "/Users/{$currentUser}/Desktop/lightspeed/";

$ReportDir      = $FilePath."blog_dump".date('Y-m-d');
$CreateDir      = mkdir($ReportDir);

$ResultsFile    = fopen($ReportDir."/Blog_arcticles.csv", "w");
fputcsv($ResultsFile, array('Blog','Article ID','Article Title','Blog Title'));

echo $C->getColoredString('[INFO] Working Dir Created '. $ReportDir, 'green')."\n";

$counter = 1;
$rowCount = 0;

try {

    $ApiC = new WebshopappApiClient($API['cluster'], $API['apiKey'], $API['apiSecret'], $API['apiLanguage']);
    
    $BlogsArticlesCount = $ApiC->blogsArticles->count();
        
    echo $C->getColoredString("[INFO] ".$BlogsArticlesCount." needs to be processed.","yellow")."\n";

    $BlogArticleCountPages = ceil($BlogsArticlesCount / $PageLimit);

    for ($BlogArticleCountPage = 1; $BlogArticleCountPage <= $BlogArticleCountPages; $BlogArticleCountPage++) {

        Helper::checkAPISleep($ApiRequestsCount);

        $Params['page'] = $BlogArticleCountPage;
        $Params['limit'] = $PageLimit;
    
        $BlogsArticles = $ApiC->blogsArticles->get(null, $Params);
        $ApiRequestsCount++;       

        foreach ($BlogsArticles as $blogsArticle => $value) { 

                        
            $blogArticleTitle = $value['title'];
            $blogArticleId = $value['id'];

            $blog = $ApiC->blogs->get($blogId);
            $blogTitle = $blog['title'];

            $row = [
                $blogId,
                $blogArticleId,
                $blogArticleTitle,
                $blogTitle
            ];
           
            fputcsv($ResultsFile, $row);
            $BlogsArticlesCount--;
            echo "Blog Article {$BlogsArticlesCount}\n";
        }
        
   }
} catch (Exception $e){

    echo $C->getColoredString('[ERROR] Invalid API Credentials on setting up API connection', 'red')."\n";
    echo $C->getColoredString('[ERROR]' . $e->getMessage() . $e->getTraceAsString(), 'red')."\n";
}
fclose($ResultsFile);

echo $C->getColoredString('[INFO] File will be opened', 'green')."\n";

exec ("open ".$ReportDir);

echo $C->getColoredString('[END] Getting Blogs with articles.', 'blue')."\n";