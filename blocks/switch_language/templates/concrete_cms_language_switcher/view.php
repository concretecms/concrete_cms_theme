<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\View\View;

/* @var string $label */

/** @noinspection PhpUnhandledExceptionInspection */
View::element("language_switcher", ["label" => $label],"concrete_cms_theme");