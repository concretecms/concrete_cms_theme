<?php

/**
 * @project:   Concrete CMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied');

use Concrete\Core\Application\Service\FileManager;
use Concrete\Core\Block\View\BlockView;
use Concrete\Core\Editor\EditorInterface;
use Concrete\Core\Entity\File\File;
use Concrete\Core\Form\Service\Form;
use Concrete\Core\Support\Facade\Application;

/** @var File|null $image */
/** @var string $title */
/** @var string $description */
/** @var BlockView $view */

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);
/** @var FileManager $fileManager */
$fileManager = $app->make(FileManager::class);
/** @var EditorInterface $editor */
$editor = $app->make(EditorInterface::class);

?>

<div class="form-group">
    <?php echo $form->label("fID", t('Image')); ?>
    <?php echo $fileManager->image("fID", "fID", t("Please select..."), $image); ?>

    <?php echo $form->label("title", t('Title')); ?>
    <?php echo $form->text("title", $title); ?>

    <?php echo $form->label("description", t('Description')); ?>
    <?php echo $editor->outputStandardEditor("description", $description); ?>
</div>