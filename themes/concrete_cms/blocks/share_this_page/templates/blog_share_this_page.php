<?php defined('C5_EXECUTE') or die("Access Denied."); ?>

<div class="ccm-block-share-this-page mt-5">

    <hr>
    
    <ul class="list-inline">
    <?php foreach ($selected as $service) {
        $page = Page::getCurrentPage();
    ?>
        <li><a target="_blank" href="<?= h($service->getServiceLink($page)) ?>"><?=$service->getServiceIconHTML()?></a></li>
    <?php
} ?>
    </ul>
</div>
