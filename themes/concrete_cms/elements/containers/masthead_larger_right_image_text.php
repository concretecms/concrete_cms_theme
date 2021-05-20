<?php

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\ContainerArea;
?>

<div class="container container-masthead-image-text">
    <div class="row">
        <div class="col-md-6 order-2 order-md-1 align-self-center">
            <div class="pl-md-5">
            <?php
            $area = new ContainerArea($container, 'Content');
            $area->display($c);
            ?>
            </div>
        </div>
        <div class="col-md-6 order-1 order-md-2">
            <?php
            $area = new ContainerArea($container, 'Image');
            $area->display($c);
            ?>
        </div>
    </div>
</div>