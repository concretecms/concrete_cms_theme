<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\Area;
use Concrete\Core\Entity\File\File;
use Concrete\Core\Entity\File\Version;
use Concrete\Core\Page\Page;
use Concrete\Core\Page\PageList;
use Concrete\Core\View\View;
use Concrete\Core\Entity\Package;
use Concrete\Core\Package\PackageService;
use Concrete\Core\Support\Facade\Application;
use Concrete\Package\ConcreteCmsTheme\Controller;
use Concrete\Core\Summary\Template\Renderer;

/** @var View $this */
/** @var Page $c */

/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/header.php');

$app = Application::getFacadeApplication();
/** @var PackageService $packageService */
$packageService = $app->make(PackageService::class);
/** @var Renderer $templateRenderer */
$templateRenderer = $app->make(Renderer::class);
/** @var PageList $pageList */
$pageList = $app->make(PageList::class);
/** @var Package $pkgEntity */
$pkgEntity = $packageService->getByHandle("concrete_cms_theme");
/** @var Controller $pkg */
$pkg = $pkgEntity->getController();

$defaultThumbnailUrl = $pkg->getRelativePath() . "/images/default_thumbnail.jpg";

$c = Page::getCurrentPage();

$developerName = (string)$c->getAttribute("developer_name") ?? t("Unknown");
$developerUrl = (string)$c->getAttribute("developer_url");
$siteName = (string)$c->getAttribute("site_name") ?? t("Unknown");
$siteUrl = (string)$c->getAttribute("site_url");
$thumbnail = $c->getAttribute("thumbnail");

$pageList->filterByPageTypeHandle("case_study");
$pageList->getQueryObject()
    ->andWhere("p.cID != :ownPageId")
    ->orderBy('RAND()')
    ->setParameter("ownPageId", $c->getCollectionID());

$pageList->setItemsPerPage(3);

$showPagination = false;

/** @noinspection PhpDeprecationInspection */
$pagination = $pageList->getPagination();
$relatedCaseStudies = $pagination->getCurrentPageResults();

?>

<main class="case-study-detail">
    <div class="case-study-header">
        <div class="container">
            <div class="row">
                <div class="col">
                    <?php
                    $thumbnailUrl = null;

                    if ($thumbnail instanceof File) {
                        $thumbnailApprovedVersion = $thumbnail->getApprovedVersion();

                        if ($thumbnailApprovedVersion instanceof Version) {
                            $thumbnailUrl = $thumbnailApprovedVersion->getURL();
                        }
                    }
                    ?>
                    <img src="<?php echo $thumbnailUrl ?? $defaultThumbnailUrl; ?>"
                         alt="<?php echo h($c->getCollectionName()); ?>" class="img-fluid">
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 col-sm-12">
                    <h1 class="case-study-project-name">
                        <?php echo $c->getCollectionName(); ?>
                    </h1>
                </div>

                <div class="col-md-6 col-sm-12">
                    <div class="float-md-right float-lg-right float-xl-right float-sm-left float-xs-left">
                        <div class="developer">
                            <?php if (strlen($developerUrl) > 0) { ?>
                                <?php /** @noinspection HtmlUnknownTarget */
                                echo t("Developer by %s", sprintf(
                                    "<a href=\"%s\" rel='nofollow'>%s</a>",
                                    $developerUrl,
                                    $developerName
                                )); ?>
                            <?php } else { ?>
                                <?php echo t("Developed by %s", $developerName); ?>
                            <?php } ?>
                        </div>

                        <div class="site">
                            <?php if (strlen($siteUrl) > 0) { ?>
                                <?php /** @noinspection HtmlUnknownTarget */
                                echo t("Project URL %s", sprintf( // the label is called project url. should the domain name used instead?
                                    "<a href=\"%s\" rel='nofollow'>%s</a>",
                                    $siteUrl, //
                                    $siteName
                                )); ?>
                            <?php } else { ?>
                                <?php echo t("Project URL %s", $siteUrl); ?>
                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <hr>
                </div>
            </div>
        </div>
    </div>

    <div class="case-study-body col-content">
        <?php
        $a = new Area('Main');
        $a->enableGridContainer();
        $a->display($c);

        // Render additional areas if required
        for ($i = 1; $i <= (int)$c->getAttribute('main_area_number'); $i++) {
            $a = new Area('Main ' . $i);
            $a->enableGridContainer();
            $a->display($c);
        }
        ?>
    </div>

    <?php if (count($relatedCaseStudies) > 0) { ?>
        <div class="case-study-footer">
            <div class="case-study-list-view">
                <div class="container">
                    <div class="row">
                        <div class="col">
                            <h2>
                                <?php echo t("View Other Case Studies"); ?>
                            </h2>
                        </div>
                    </div>

                    <div class="row">
                        <?php foreach ($relatedCaseStudies as $relatedCaseStudy) { ?>
                            <div class="col-md-4 col-sm-6 col-xs-12">
                                <?php $templateRenderer->renderSummaryForObject($relatedCaseStudy, "case_study_item"); ?>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    <?php } ?>
</main>

<?php
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/footer.php');
?>
