<?php

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\ContainerArea;
?>

<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="feature-section-container">
                <div class="feature-section-title">
                    <?php
                    $area = new ContainerArea($container, 'Title');
                    $area->display($c);
                    ?>
                </div>
                <div class="feature-section-items">
                    <?php
                    $area = new ContainerArea($container, 'Items');
                    $area->display($c);
                    ?>
                </div>

                <?php if ($c->isEditMode()) { ?>
                    <div class="alert alert-info" style="opacity: 0.5">
                        <?=t("<b>Note:</b> If you're adding Feature Item blocks to the Items area, make sure you use the <code>Feature List Button Right</code> custom template.")?>
                    </div>
                <?php } ?>
            </div>
        </div>
    </div>
</div>