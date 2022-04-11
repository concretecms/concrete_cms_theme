<?php
if (filter_var($_ENV['SHOW_STAGE_WARNING'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
    ?>
    <div
        style="bottom:0;left:0;right:0;z-index:99999;height:40px;border-top:solid 2px #FF4136!important"
        class="alert alert-danger border-top mb-0 py-0 text-center position-fixed d-flex items-center flex-column justify-content-center">
        <span>STAGE</span>
    </div>
    <style>
        body {
            margin-bottom:40px;
        }
    </style>
    <?php
}