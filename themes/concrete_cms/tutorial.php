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
                $bt->render("templates/tutorial_title/view");
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
            </div>

            <div class="col-sm-4 col-sidebar">
                <?php
                $bt = BlockType::getByHandle("tutorial_related_list");
                $bt->controller->set("title", t("Recent Tutorials"));
                $bt->controller->set("maxNumber", 3);
                $bt->controller->set("sortByOptions", "newest");
                $bt->render("view");

                $stack = Stack::getByName('Thumbs');
                if ($stack) {
                    $stack->display();
                }

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
