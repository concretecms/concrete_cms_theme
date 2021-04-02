<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\Area;
use Concrete\Core\Block\BlockType\BlockType;
use Concrete\Core\Page\Page;
use Concrete\Core\View\View;

/** @var View $this */
/** @var Page $c */

/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/header.php');

?>

<main>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <?php
                $bt = BlockType::getByHandle("page_title");
                $bt->render("templates/docs_title/view");
                ?>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-8  col-content">
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

                <?php
                $c = Page::getCurrentPage();
                /** @noinspection PhpParamsInspection */
                $area = Area::get($c, "Main");
                $bt = BlockType::getByHandle("likes_this");
                /** @noinspection PhpUndefinedMethodInspection */
                $bt->controller->setAreaObject($area);
                $bt->render("view");
                ?>
            </div>

            <div class="col-sm-4 col-sidebar">
                <?php
                $bt = BlockType::getByHandle("autonav");
                $bt->controller->displayPages = 'custom';
                $bt->controller->orderBy = 'display_asc';
                $bt->controller->displayPagesCID = Page::getByPath("/developers")->getCollectionID();
                $bt->controller->displaySubPages = 'relevant';
                $bt->controller->displaySubPageLevels = 'all';
                $bt->controller->displaySubPageLevelsNum = 0;
                $bt->render("templates/docs_sidebar/view");
                ?>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <?php
                $a = new Area('Page Footer');
                $a->enableGridContainer();
                $a->display($c);
                ?>
            </div>
        </div>
    </div>
</main>

<?php
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/footer.php');
?>
