<?php

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Page\Page;
use Concrete\Core\Page\PageList;
use Concrete\Core\Summary\Template\Renderer;
use Concrete\Core\Support\Facade\Application;

/** @var string $pageListTitle */
/** @var PageList $list */
/** @var int $num */
/** @var Page[] $pages */
/** @var bool $showPagination */
/** @var string $pagination */

$app = Application::getFacadeApplication();
/** @var Renderer $templateRenderer */
$templateRenderer = $app->make(Renderer::class);

?>

<div class="case-study-list-view">
    <div class="row">
        <div class="col">
            <h2>
                <?php echo $pageListTitle; ?>
            </h2>
        </div>
    </div>

    <div class="row">
        <?php foreach ($pages as $page) { ?>
            <div class="col-md-4 col-sm-6 col-xs-12">
                <?php $templateRenderer->renderSummaryForObject($page, "case_study_item"); ?>
            </div>
        <?php } ?>
    </div>
</div>
