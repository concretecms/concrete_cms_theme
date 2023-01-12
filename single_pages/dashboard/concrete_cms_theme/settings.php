<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access denied');

use Concrete\Core\Form\Service\Form;
use Concrete\Core\Form\Service\Widget\PageSelector;
use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Validation\CSRF\Token;

/** @var bool $enableDarkMode */
/** @var int $searchPageId */
/** @var Concrete\Core\Tree\Tree $tree */

$app = Application::getFacadeApplication();
/** @var Form $form */
$form = $app->make(Form::class);
/** @var Token $token */
$token = $app->make(Token::class);
/** @var PageSelector $pageSelector */
$pageSelector = $app->make(PageSelector::class);

?>

<form action="#" method="post">
    <?php echo $token->output("update_settings"); ?>

    <fieldset>
        <legend>
            <?php echo t("General"); ?>
        </legend>

        <div class="form-group">
            <div class="form-check">
                <?php echo $form->checkbox("enableDarkMode", 1, $enableDarkMode, ["class" => "form-check-input"]); ?>
                <?php echo $form->label("enableDarkMode", t("Enable Dark Mode"), ["class" => "form-check-label"]); ?>
            </div>

            <div class="help-block">
                <?php echo t("If you enable this checkbox the entire theme will be rendered in the dark mode theme. If you want to enable the dark mode just for a specific page you can do so by setting a page attribute."); ?>
            </div>
        </div>

        <div class="form-group">
            <?php echo $form->label("searchPageId", t("Search Page")); ?>
            <?php echo $pageSelector->selectPage("searchPageId", $searchPageId); ?>
        </div>
    </fieldset>

    <div class="ccm-dashboard-form-actions-wrapper">
        <div class="ccm-dashboard-form-actions">
            <div class="float-end">
                <button type="submit" class="btn btn-primary">
                    <i class="fa fa-save"></i> <?php echo t("Save"); ?>
                </button>
            </div>
        </div>
    </div>
</form>