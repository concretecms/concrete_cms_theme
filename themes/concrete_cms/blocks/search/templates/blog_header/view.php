<?php defined('C5_EXECUTE') or die('Access Denied.');

$title = $title ?? null;
$query = $query ?? null;
?>


<div class="ccm-search-block-blog-header d-flex">
    <?php if ($title) { ?>
    <h4 class="mb-0 me-auto"><a href="<?=URL::to('/about/blog')?>"><?=$title?></a></h4>
    <?php } ?>

    <div class="ms-auto form-inline">
        <form action="<?=$view->url($resultTargetURL)?>" method="get" class="ccm-search-block-form">
        <?php
if ($query === '') {
    ?><input name="search_paths[]" type="hidden" value="<?=htmlentities($baseSearchPath, ENT_COMPAT, APP_CHARSET) ?>" /><?php
} elseif (isset($_REQUEST['search_paths']) && is_array($_REQUEST['search_paths'])) {
    foreach ($_REQUEST['search_paths'] as $search_path) {
        ?><input name="search_paths[]" type="hidden" value="<?=htmlentities($search_path, ENT_COMPAT, APP_CHARSET) ?>" /><?php
    }
}
?><input name="query" type="text" value="<?=htmlentities($query, ENT_COMPAT, APP_CHARSET)?>" class="form-control" /><?php
if (isset($buttonText) && ($buttonText !== '')) {
    ?> <input name="submit" type="submit" value="<?=h($buttonText)?>" class="btn btn-default ccm-search-block-submit" /><?php
}
?>
        </form>
    </div>
</div>

<hr>