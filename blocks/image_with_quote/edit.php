<?php

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied');

use Concrete\Core\Application\Service\FileManager;
use Concrete\Core\Entity\File\File;
use Concrete\Core\Form\Service\Form;
use Concrete\Core\Support\Facade\Application;

/** @var array $backgroundOptions */
/** @var array $alignmentOptions */
/** @var string $quote */
/** @var string $name */
/** @var File $image */
/** @var string $background */
/** @var string $alignment */

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);
/** @var FileManager $fileManager */
$fileManager = $app->make(FileManager::class);

?>

<div class="form-group">
    <?php echo $form->label("name", t('Name')); ?>
    <?php echo $form->text("name", $name) ?>
</div>

<div class="form-group">
    <?php echo $form->label("quote", t('Quote')); ?>
    <?php echo $form->textarea("quote", $quote) ?>
</div>

<div class="form-group">
    <?php echo $form->label("fID", t('Image')); ?>
    <?php echo $fileManager->image("fID", "fID", t("Please select..."), $image); ?>
</div>

<div class="form-group">
    <?php echo $form->label("background", t('Background')); ?>
    <?php echo $form->select("background", $backgroundOptions, $background) ?>
</div>

<div class="form-group">
    <?php echo $form->label("alignment", t('Alignment')); ?>
    <?php echo $form->select("alignment", $alignmentOptions, $alignment) ?>
</div>