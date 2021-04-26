<?php

defined('C5_EXECUTE') or die("Access Denied.");

View::element('two_column_container', [
    'c' => $c,
    'container' => $container
], 'concrete_cms_theme');
?>