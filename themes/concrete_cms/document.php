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
use Concrete\Core\Block\View\BlockView;

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
                $bt = BlockType::getByHandle('switch_release_version');
                if (is_object($bt)) {
                    $bt->render();
                }
                ?>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-4 col-sidebar order-md-0 order-1">
                <?php
                $a = new Area('Sidebar');
                $a->display($c);

                $stack = Stack::getByName('Thumbs');
                if ($stack) {
                    $stack->display();
                }

                ?>
            </div>

            <div class="col-sm-8  col-content order-md-1 order-0">
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
