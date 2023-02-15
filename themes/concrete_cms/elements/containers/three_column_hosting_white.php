<?php

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\ContainerArea;
?>


<div class="column-section-container three-column-hosting-white ">
    <div class="container">
        <?php $titleArea = new ContainerArea($container, 'Title'); ?>
        <div class="row">
            <div class="col-12">
                <?php $titleArea->display($c); ?>
            </div>
        </div>
        <div class="row row-cols-1 row-cols-lg-3 g-4">
            <div class="col">
                <div class="card h-100">
                    <div class="card-body p-4">
                        <?php
                        $area = new ContainerArea($container, 'Column One');
                        $area->display($c);
                        ?>
                    </div>
                    <?php $footerArea = new ContainerArea($container, 'Column One Footer'); ?>
                    <?php if ($c->isEditMode() || $footerArea->getTotalBlocksInArea($c) > 0) { ?>
                        <div class="card-footer">
                        <?php
                        $footerArea->display($c);
                        ?>
                    </div>
                    <?php } ?>
                </div>
            </div>
            <div class="col">
                <div class="card h-100">
                    <div class="card-body">
                        <?php
                        $area = new ContainerArea($container, 'Column Two');
                        $area->display($c);
                        ?>
                    </div>
                    <?php $footerArea = new ContainerArea($container, 'Column Two Footer'); ?>
                    <?php if ($c->isEditMode() || $footerArea->getTotalBlocksInArea($c) > 0) { ?>
                        <div class="card-footer">
                            <?php
                            $footerArea->display($c);
                            ?>
                        </div>
                    <?php } ?>
                </div>
            </div>
            <div class="col">
                <div class="card h-100">
                    <div class="card-body">
                        <?php
                        $area = new ContainerArea($container, 'Column Three');
                        $area->display($c);
                        ?>
                    </div>
                    <?php $footerArea = new ContainerArea($container, 'Column Three Footer'); ?>
                    <?php if ($c->isEditMode() || $footerArea->getTotalBlocksInArea($c) > 0) { ?>
                        <div class="card-footer">
                            <?php
                            $footerArea->display($c);
                            ?>
                        </div>
                    <?php } ?>
                </div>
            </div>
        </div>


    </div>
</div>