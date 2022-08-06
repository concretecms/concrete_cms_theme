<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\GlobalArea;
use Concrete\Core\Localization\Localization;
use Concrete\Core\Page\Page;
use Concrete\Core\Support\Facade\Url;
use Concrete\Core\Validation\CSRF\Token;use Concrete\Core\View\View;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Config\Repository\Repository;
use PortlandLabs\ConcreteCmsTheme\Navigation\UrlManager;
/** @var View $view */

$app = Application::getFacadeApplication();
/** @var Token $token */
$token = $app->make(Token::class);
/** @var Repository $config */
$config = Site::getSite()->getConfigRepository();
$site = Site::getSite();

$excludeBreadcrumb = false;
if ($c->isHomePage() ||
    strpos($c->getCollectionPath(), '/account') === 0 ||
    $c->getPageController()->get("exclude_breadcrumb") ||
    $c->getAttribute("exclude_breadcrumb")) {

    $excludeBreadcrumb = true;
}
$enableDarkMode = $config->get("concrete_cms_theme.enable_dark_mode") ||$c->getAttribute("enable_dark_mode");

$manager = $app->make(UrlManager::class);
$marketingUrl = $manager->getMarketingUrl();
$opensourceUrl = $manager->getMarketingOrgUrl();
$searchPageUrl = $manager->getSearchPageUrl($site);

$subnavElement = Element::get('sub_nav_custom');

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

    <script type="text/javascript">
        <?php echo "var CCM_SECURITY_TOKEN = '" . $token->generate() . "';"; ?>
    </script>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<?php
$view->inc('elements/stage_warning.php');
?>
<script class="disclosure" role="template" type='text/template'>
    <div class='disclosure-container ccm-ui'>
        <div class='disclosure'>
            <div>
                <p>
                    This website stores cookies on your computer. These cookies are used to improve
                    your website experience and provide more personalized services to you, both on this website and through
                    other media. To find out more about the cookies we use, see our <a href='https://www.concretecms.com/about/legal/privacy-policy' target='_blank'>Privacy Policy</a>.
                </p>
            </div>
            <button class='ack btn btn-primary '>Accept</button>
        </div>
    </div>
</script>

<div id="ccm-loading-screen" style="display: none">
    <div class="loading-wrapper">
        <div class="loader"></div>
    </div>
</div>

<div class="<?php echo $c->getPageWrapperClass() ?><?php echo $enableDarkMode ? " ccm-dark-mode" : "";?>">
    <header class="<?php echo $excludeBreadcrumb ? "no-breadcrumb" : ""; ?> <?php $subnavElement->exists() ? "has-sub-nav" : ""; ?>">
        <div class="container">
            <nav class="navbar navbar-expand-lg navbar-light">
                <div class="navbar-inner">
                    <div class="navbar-brand">
                        <div class="header-site-title">
                            <?php if ($enableDarkMode) { ?>
                                <a href="<?=(string) $opensourceUrl?>">
                                    <img src="<?=$view->getThemePath()?>/images/logo_text_dark_mode.svg" alt="" class="img-fluid">
                                </a>
                            <?php } else { ?>
                                <a href="<?=(string) $marketingUrl?>">
                                    <img src="<?=$view->getThemePath()?>/images/logo_text.svg" alt="" class="img-fluid">
                                </a>
                            <?php } ?>
                        </div>
                    </div>

                    <a href="<?=$searchPageUrl?>" class="d-block d-lg-none"
                       id="ccm-mobile-search-btn">
                        <i class="fas fa-search"></i>
                    </a>

                    <button id="ccm-toggle-mobile-nav"
                            class="hamburger hamburger--spin navbar-toggler d-block d-lg-none"
                            type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                    </button>
                </div>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <div id="ccm-desktop-nav" class="header-navigation ms-auto">
                        <?php
                        $element = Element::get('header_navigation', 'concrete_cms_theme');
                        $element->render();
                        ?>
                    </div>
                </div>
            </nav>
        </div>

        <?php
        /** @noinspection PhpUnhandledExceptionInspection */
        if ($subnavElement->exists()) {
            $subnavElement->render();
        }
        ?>
    </header>

    <?php if (!$excludeBreadcrumb) { ?>
        <div class="container">
            <div class="row">
                <div class="col">
                    <div class="breadcrumb-navigation">
                        <?php
                        $a = new GlobalArea('Header Breadcrumb Navigation');
                        $a->display($c);
                        ?>
                    </div>
                </div>
            </div>
        </div>
    <?php } ?>
