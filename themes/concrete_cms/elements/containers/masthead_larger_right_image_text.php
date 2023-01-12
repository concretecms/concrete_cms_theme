<?php

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\ContainerArea;
?>

<div class="container container-masthead-image-text">
    <div class="row">
        <div class="col-lg-6 order-2 order-lg-1 align-self-center">
            <div class="pe-lg-5">
            <?php
            $area = new ContainerArea($container, 'Content');
            $area->display($c);
            ?>
            </div>
        </div>
        <div class="col-lg-6 order-1 order-lg-2">
            <?php
            $area = new ContainerArea($container, 'Image');
            $area->display($c);
            ?>
        </div>
    </div>
</div>