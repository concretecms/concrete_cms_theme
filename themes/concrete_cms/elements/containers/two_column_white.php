<?php

defined('C5_EXECUTE') or die("Access Denied.");

View::element('two_column_container', [
    'c' => $c,
    'container' => $container,
    'color' => 'white',
], 'concrete_cms_theme');