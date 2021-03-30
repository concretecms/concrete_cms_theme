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

$searchPageId = (int)$config->get("concrete_cms_theme.search_page_id");
$searchPage = Page::getByID($searchPageId);
$excludeBreadcrumb = $c->isHomePage() || strpos($c->getCollectionPath(), '/account') === 0 || $c->getPageController()->get("exclude_breadcrumb") || $c->getAttribute("exclude_breadcrumb");
$enableDarkMode = $config->get("concrete_cms_theme.enable_dark_mode") ||$c->getAttribute("enable_dark_mode");

$marketingUrl = $app->make(UrlManager::class)->getMarketingUrl();

?>
<!DOCTYPE html>
<html lang="<?php echo Localization::activeLanguage() ?>">
<head>
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
<div class="<?php echo $c->getPageWrapperClass() ?><?php echo $enableDarkMode ? " ccm-dark-mode" : "";?>">
    <header class="<?php echo $excludeBreadcrumb ? "no-breadcrumb" : ""; ?> <?php echo $c->getCollectionParentID() > 0 ? "has-sub-nav" : ""; ?>">
        <div class="container">
            <nav class="navbar navbar-expand-lg navbar-light">
                <div class="navbar-inner">
                    <div class="navbar-brand">
                        <div class="header-site-title">
                            <a href="<?=(string) $marketingUrl?>">
                            <?php if ($enableDarkMode) { ?>
                                <img src="<?=$view->getThemePath()?>/images/logo_text_dark_mode.svg" alt="" class="img-fluid">
                            <?php } else { ?>
                                <img src="<?=$view->getThemePath()?>/images/logo_text.svg" alt="" class="img-fluid">
                            <?php } ?>
                            </a>
                        </div>
                    </div>

                    <?php if ($searchPage instanceof Page && !$searchPage->isError()) { ?>
                        <a href="<?php echo (string)Url::to($searchPage); ?>" class="d-block d-lg-none"
                           id="ccm-mobile-search-btn">
                            <i class="fas fa-search"></i>
                        </a>
                    <?php } ?>

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
                    <div id="ccm-desktop-nav" class="header-navigation ml-auto">
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
        $this->inc('elements/sub_nav.php');
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