<?php

defined('C5_EXECUTE') or die("Access Denied.");

View::element('two_column_container', [
    'c' => $c,
    'container' => $container,
    'color' => 'blue',
    'leftColumnClass' => 'col-md-6',
    'rightColumnClass' => 'col-md-6',
], 'concrete_cms_theme');
?>