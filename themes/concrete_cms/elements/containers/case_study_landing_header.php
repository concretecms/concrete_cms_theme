<?php

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\ContainerArea;

?>

<div class="case-study-landing-header">
    <div class="container">
        <div class="row">
            <div class="col-md-6 image-slider">
                <?php
                $area = new ContainerArea($container, 'Image Slider');
                $area->display($c);
                ?>
            </div>

            <div class="col-md-6 content">
                <?php
                $area = new ContainerArea($container, 'Headline');
                $area->display($c);
                ?>
            </div>
        </div>
    </div>
</div>