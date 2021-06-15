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
    <div class="mt-5 mb-5">
        <?php
        $a = new Area('Page Header');
        if ($c->isEditMode() || $a->getTotalBlocksInArea($c) > 0) { ?>
            <div class="row">
                <div class="col-sm-12">
                    <?php
                    $a->display($c);
                    ?>
                </div>
            </div>
        <?php } ?>
        <?php
        $a = new Area('Main');
        $a->enableGridContainer();
        $a->display($c);
        ?>
    </div>

    <?php
    $a = new Area('Main Footer');
    $a->enableGridContainer();
    $a->display($c);
    ?>
</main>

<?php
/** @noinspection PhpUnhandledExceptionInspection */
$this->inc('elements/footer.php');
?>
