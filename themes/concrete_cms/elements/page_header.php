<?php

defined('C5_EXECUTE') or die("Access Denied.");

$a = new Area('Page Header');
if ($c->isEditMode() || $a->getTotalBlocksInArea($c) > 0) { ?>
    <div class="page-header">
        <?php
        $a->enableGridContainer();
        $a->display($c);
        ?>
    </div>
<?php
}