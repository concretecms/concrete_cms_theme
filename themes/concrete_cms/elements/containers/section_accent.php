<?php

defined('C5_EXECUTE') or die("Access Denied.");

use Concrete\Core\Area\ContainerArea;
?>

<section class="content-section accent-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <?php
                $area = new ContainerArea($container, 'Content');
                $area->display($c);
                ?>
            </div>
        </div>
    </div>
</section>