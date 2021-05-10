<?php

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied');

use Concrete\Core\Form\Service\Form;
use Concrete\Core\Support\Facade\Application;

/** @var string $figure */
/** @var string $legend */

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);

?>

<div class="form-group">
    <?php echo $form->label("figure", t('Figure')); ?>
    <?php echo $form->text("figure", $figure) ?>
</div>

<div class="form-group">
    <?php echo $form->label("legend", t('Legend')); ?>
    <?php echo $form->text("legend", $legend) ?>
</div>