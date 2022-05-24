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
$view->inc('elements/header.php');

// Byline
$dh = app('date');
$date = $dh->formatDate($c->getCollectionDatePublic(), true);
$user = UserInfo::getByID($c->getCollectionUserID());

// Thumbnail Stuff
$packageService = app(PackageService::class);
$pkgEntity = $packageService->getByHandle("concrete_cms_theme");
$pkg = $pkgEntity->getController();
$defaultThumbnailUrl = $pkg->getRelativePath() . "/images/default_thumbnail.jpg";
$thumbnail = $c->getAttribute("thumbnail");

// Related/Category Stuff
$pageList = app(PageList::class);
$c = Page::getCurrentPage();
$parent = Page::getByID($c->getCollectionParentID());
$relatedBlogEntries = [];
if ($parent->getCollectionTypeHandle() == 'blog_category') {
    $category = $parent;
    $pageList->filterByPageTypeHandle("blog_entry");
    $pageList->filterByParentID($category->getCollectionID());
    $pageList->getQueryObject()
        ->andWhere("p.cID != :ownPageId")
        ->setParameter("ownPageId", $c->getCollectionID());
    $pageList->sortByPublicDateDescending();
    $pageList->setItemsPerPage(3);
    /** @noinspection PhpDeprecationInspection */
    $pagination = $pageList->getPagination();
    $relatedBlogEntries = $pagination->getCurrentPageResults();
}


?>

<main class="blog-entry-wide">
    <div class="blog-entry-header">
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
                    <img src="<?php
                    echo $thumbnailUrl ?? $defaultThumbnailUrl; ?>"
                         alt="<?php
                         echo h($c->getCollectionName()); ?>" class="img-fluid">
                </div>
            </div>

            <div class="row">
                <div class="col-md-7 col-sm-12">
                    <h1 class="blog-entry-title">
                        <?php
                        echo $c->getCollectionName(); ?>
                    </h1>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <hr>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-2 col-4"><?=$date?></div>
                <?php if (is_object($user)) { ?>
                    <div class="col-md-7 col-4">
                        by
                        <span class="page-author">
                            <?= $user->getUserDisplayName(); ?>
                       </span>
                    </div>
                <?php } ?>
                <?php if (isset($category)) { ?>
                    <div class="col-md-3 col-4 text-right">
                        <?=t('in')?> <a href="<?=$category->getCollectionLink()?>"><b><?=$category->getCollectionName()?></b></a>
                    </div>
                <?php } ?>
            </div>

        </div>
    </div>

    <div class="blog-entry-body col-content">
        <div class="col-content-main">
            <?php
            $a = new Area('Main');
            $ctaText = $c->getAttribute('blog_entry_call_to_action_text');
            $ctaUrl = $c->getAttribute('blog_entry_call_to_action_url');
            if ($ctaUrl && $ctaText && !$c->isEditMode()) { ?>
            <div class="container">
                <div class="d-flex align-items-center">
                    <div class="mr-5">
                        <?php $a->display($c); ?>
                    </div>
                    <div class="ml-auto">
                        <a href="<?=$ctaUrl?>" target="_blank" class="text-nowrap btn btn-primary"><?=$ctaText?></a>
                    </div>
                </div>
            </div>

            <?php } else { ?>
                <?php
                $a->enableGridContainer();
                $a->display($c);
                ?>
            <?php } ?>
        </div>

        <?php
        $a = new Area('Blog Post More');
        $a->enableGridContainer();
        $a->display($c);
        ?>

    </div>

    <div class="blog-entry-footer">
        <?php
        if (count($relatedBlogEntries) > 0) { ?>
            <div class="case-study-list-view">
                <div class="container">
                    <div class="row">
                        <div class="col">
                            <h2>
                                <?php
                                echo t("More Blog Posts"); ?>
                            </h2>
                        </div>
                    </div>

                    <div class="row">
                        <?php
                        foreach ($relatedBlogEntries as $relatedBlogEntry) {
                            $link = $relatedBlogEntry->getCollectionLink();
                            $title = $relatedBlogEntry->getCollectionName();
                            $description = $relatedBlogEntry->getCollectionDescription();
                            ?>
                            <div class="col-md-4 col-sm-6 col-xs-12">

                                <div class="blog-entry-related-item d-flex flex-column">

                                    <h3 class="title">
                                        <a href="<?php echo (string)$link; ?>">
                                            <?php echo $title; ?>
                                        </a>
                                    </h3>

                                    <p class="description">
                                        <?php echo $description ?? t("No Description available"); ?>
                                    </p>

                                    <p class="text-center mt-auto">
                                    <a href="<?=$link?>" class="btn btn-outline btn-outline-primary">
                                        <?=t('Read Post')?>
                                    </a>
                                    </p>
                                </div>

                            </div>
                        <?php
                        } ?>
                    </div>
                </div>
            </div>
        <?php
        } ?>
    </div>
</main>

<?php
/** @noinspection PhpUnhandledExceptionInspection */
$view->inc('elements/footer.php');
?>
