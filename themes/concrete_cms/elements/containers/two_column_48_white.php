<?php

defined('C5_EXECUTE') or die("Access Denied.");

View::element('two_column_container', [
    'c' => $c,
    'container' => $container,
    'color' => 'white',
    'leftColumnClass' => 'col-md-4 my-auto',
    'rightColumnClass' => 'col-md-8 my-auto',
], 'concrete_cms_theme');