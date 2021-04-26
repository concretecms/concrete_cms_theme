<?php

defined('C5_EXECUTE') or die("Access Denied.");

View::element('two_column_container', [
    'c' => $c,
    'container' => $container,
    'color' => 'dark_gray',
], 'concrete_cms_theme');
?>