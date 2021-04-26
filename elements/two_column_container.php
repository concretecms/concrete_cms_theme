<?php

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Area\ContainerArea;

$containerColorClass = '';

if ($color == 'white') {
    $containerColorClass = 'column-section-container-white';
} else if ($color == 'blue') {
    $containerColorClass = 'column-section-container-blue';
} else if ($color == 'dark_gray') {
    $containerColorClass = 'column-section-container-dark-gray';
}
?>
<div class="column-section-container <?=$containerColorClass?>">
    <div class="container">
        <?php
        $titleArea = new ContainerArea($container, 'Title');
        if ($c->isEditMode() || $titleArea->getTotalBlocksInArea($c) > 0) { ?>
            <div class="row">
                <div class="col-12">
                    <div class="column-section-title">
                        <?php $titleArea->display($c); ?>
                    </div>
                </div>
            </div>
        <?php }
        ?>
        <div class="row">
            <div class="col-md-6">
                <?php
                $area = new ContainerArea($container, 'Column One');
                $area->display($c);
                ?>
            </div>
            <div class="col-md-6">
                <?php
                $area = new ContainerArea($container, 'Column Two');
                $area->display($c);
                ?>
            </div>
        </div>
    </div>
</div>