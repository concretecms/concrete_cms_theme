<?php

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Area\ContainerArea;
$color = $color ?? null;

$containerColorClass = '';
if (isset($color) && $color == 'white') {
    $containerColorClass = 'column-section-container-white';
} else if ($color == 'dark_gray') {
    $containerColorClass = 'column-section-container-dark-gray';
} else if ($color === 'blue') {
    $containerColorClass = 'column-section-container-blue';
}
?>
<section class="content-section <?=$containerColorClass?>">
    <?php
    $titleArea = new ContainerArea($container, 'Title');
    if ($c->isEditMode() || $titleArea->getTotalBlocksInArea($c) > 0) { ?>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="content-section-title">
                        <?php $titleArea->display($c); ?>
                    </div>
                </div>
            </div>
        </div>
    <?php }
    ?>
    <div class="container">
        <div class="row">
            <div class="col-md-12 content-section-column">
                <?php
                $area = new ContainerArea($container, 'Content');
                $area->setAreaGridMaximumColumns(12);
                $area->display($c);
                ?>
            </div>
        </div>
    </div>
</section>
