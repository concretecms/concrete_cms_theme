<?php

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Block\PageList\Controller;
use Concrete\Core\Localization\Service\Date;
use Concrete\Core\Page\Page;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Utility\Service\Text;

/** @var string $noResultsMessage */
/** @var string $buttonLinkText */
/** @var Page[] $pages */
/** @var bool $displayThumbnail */
/** @var Controller $controller */
$c = Page::getCurrentPage();

$app = Application::getFacadeApplication();
/** @var Text $th */
$th = $th = $app->make(Text::class);
/** @var Date $dh */
$dh = $app->make(Date::class);

$includeEntryText = (isset($includeName) && $includeName) || (isset($includeDescription) && $includeDescription) || (isset($useButtonForLink) && $useButtonForLink);
?>

<?php if (is_object($c) && $c->isEditMode() && $controller->isBlockEmpty()) { ?>
    <div class="ccm-edit-mode-disabled-item">
        <?php echo t('Empty Page List Block.') ?>
    </div>
<?php } else if (count($pages) > 0) { ?>
    <div class="blog-list-pages">
        <div class="row">
            <?php foreach ($pages as $page) { ?>
                <?php
                $title = $page->getCollectionName();

                if ($page->getCollectionPointerExternalLink() != '') {
                    $url = $page->getCollectionPointerExternalLink();
                    if ($page->openCollectionPointerExternalLinkInNewWindow()) {
                        $target = '_blank';
                    }
                } else {
                    $url = $page->getCollectionLink();
                    $target = $page->getAttribute('nav_target');
                }

                $target = empty($target) ? '_self' : $target;
                $description = $page->getCollectionDescription();
                /** @noinspection PhpUndefinedFieldInspection */
                $description = $controller->truncateSummaries ? $th->wordSafeShortText($description, $controller->truncateChars) : $description;
                $thumbnail = false;

                if ($displayThumbnail) {
                    $thumbnail = $page->getAttribute('thumbnail');
                }

                /** @noinspection PhpUnhandledExceptionInspection */
                $date = $dh->formatDate($page->getCollectionDatePublic(), true);

                ?>
                <div class="col-md-4 col-sm-6 col-xs-12">
                    <div class="blog-list-page-entry">
                        <div class="title">
                            <a href="<?php echo h($url) ?>"
                               target="<?php echo h($target) ?>">
                                <?php echo h($title) ?>
                            </a>
                        </div>

                        <div class="date">
                            <?php echo h($date) ?>
                        </div>

                        <div class="description">
                            <?php echo h($description) ?>
                        </div>

                        <div class="read-more">
                            <a href="<?php echo h($url) ?>" target="<?php echo h($target) ?>"
                               class="btn btn-secondary">
                                <?php echo h(strlen($buttonLinkText) > 0 ? $buttonLinkText : t("Read More")) ?>
                            </a>
                        </div>
                    </div>
                </div>
            <?php } ?>
        </div>
    </div>
<?php } else { ?>
    <div class="ccm-block-page-list-no-pages">
        <?php echo h($noResultsMessage) ?>
    </div>
<?php } ?>
