<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Localization\Localization;
use Concrete\Core\Page\Page;
use Concrete\Core\View\View;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Config\Repository\Repository;

/** @var View $view */

$app = Application::getFacadeApplication();
/** @var Repository $config */
$config = Site::getSite()->getConfigRepository();

if (isset($c)) {
    $enableDarkMode = $config->get("concrete_cms_theme.enable_dark_mode") || ($c instanceof Page ? $c->getAttribute(
            "enable_dark_mode"
        ) : false);
} else {
    $enableDarkMode = false;
}
?>
<!DOCTYPE html>
<html lang="<?php echo Localization::activeLanguage() ?>">
<head>
    <link rel="preconnect" href="https://www.googletagmanager.com">
    <link rel="preconnect" href="https://www.google-analytics.com">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--suppress HtmlUnknownTarget -->
    <link rel="stylesheet" type="text/css" href="<?php echo $view->getThemePath() ?>/css/main.css"/>
    <?php
    /** @noinspection PhpUnhandledExceptionInspection */
    View::element('header_required', [
        'pageTitle' => isset($pageTitle) ? $pageTitle : '',
        'pageDescription' => isset($pageDescription) ? $pageDescription : '',
        'pageMetaKeywords' => isset($pageMetaKeywords) ? $pageMetaKeywords : ''
    ]);
    ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<?php
$view->inc('elements/stage_warning.php');
?>
<div id="ccm-loading-screen" style="display: none">
    <div class="loading-wrapper">
        <div class="loader"></div>
    </div>
</div>

<?php
$pageWrapperClass = 'ccm-page';
if (isset($c)) {
    $pageWrapperClass = $c->getPageWrapperClass();
}
?>
<div class="<?=$pageWrapperClass?><?php echo $enableDarkMode ? " ccm-dark-mode" : "";?>">
