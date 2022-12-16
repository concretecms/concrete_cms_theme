<?php

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\ContainerArea;
?>

<div class="container container-masthead-image-text">
    <div class="row">
        <div class="col-lg-4">
            <?php
            $area = new ContainerArea($container, 'Image');
            $area->display($c);
            ?>
        </div>
        <div class="col-lg-8 align-self-center">
            <div class="ps-lg-5">
            <?php
            $area = new ContainerArea($container, 'Content');
            $area->display($c);
            ?>
            </div>
        </div>
    </div>
</div>