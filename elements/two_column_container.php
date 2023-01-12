<?php

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Area\ContainerArea;

$color = $color ?? null;
$containerColorClass = '';

if ($color == 'white') {
    $containerColorClass = 'column-section-container-white';
} else if ($color == 'blue') {
    $containerColorClass = 'column-section-container-blue';
} else if ($color == 'dark_gray') {
    $containerColorClass = 'column-section-container-dark-gray';
}

if (!isset($leftColumnClass)) {
    $leftColumnClass = 'col-md-6 my-auto';
}
if (!isset($rightColumnClass)) {
    $rightColumnClass = 'col-md-6 my-auto';
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

        // h-100, my-auto comes from new-499
        ?>
        <div class="row h-100">
            <div class="<?=$leftColumnClass?>">
                <?php
                $area = new ContainerArea($container, 'Column One');
                $area->display($c);
                ?>
            </div>
            <div class="<?=$rightColumnClass?>">
                <?php
                $area = new ContainerArea($container, 'Column Two');
                $area->display($c);
                ?>
            </div>
        </div>
    </div>
</div>