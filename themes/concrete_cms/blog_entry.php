<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\Area;
use Concrete\Core\Page\Page;
use Concrete\Core\View\View;

/** @var View $this */
/** @var Page $c */

/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/header.php');

?>

<main>
    <?php
    $a = new Area('Page Header');
    $a->enableGridContainer();
    $a->display($c);
    ?>
    <div class="container">
        <div class="row">
            <div class="col-lg-3 col-sm-4">
                <?php
                $a = new Area('Sidebar');
                $a->display($c);
                ?>
            </div>
            <div class="col-lg-8 col-lg-offset-1 col-sm-8 col-content">
                <?php
                $a = new Area('Blog Post Header');
                $a->setAreaGridMaximumColumns(12);
                $a->display($c);
                ?>
                <?php
                $a = new Area('Main');
                $a->setAreaGridMaximumColumns(12);
                $a->display($c);
                ?>
                <?php
                $a = new Area('Blog Post More');
                $a->setAreaGridMaximumColumns(12);
                $a->display($c);
                ?>

            </div>
        </div>
    </div>

    <?php
    $a = new Area('Page Footer');
    $a->enableGridContainer();
    $a->display($c);
    ?>
</main>

<?php
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/footer.php');
?>
