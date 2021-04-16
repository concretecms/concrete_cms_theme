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
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <?php
                $a = new Area('Page Header');
                $a->display($c);
                ?>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-4 col-sidebar">
                <?php
                $a = new Area('Sidebar');
                $a->display($c);

                $a = new Area('Sidebar Footer');
                $a->display($c);
                ?>
            </div>

            <div class="col-sm-8 col-content">
                <?php
                $a = new Area('Main');
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
