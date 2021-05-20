<?php

defined('C5_EXECUTE') or die("Access Denied.");
use Concrete\Core\Area\ContainerArea;

?>

<section class="section-solution">
    <div class="container">
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
</section>