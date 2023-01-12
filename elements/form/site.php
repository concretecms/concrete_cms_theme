<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Attribute\Form\Control\View\View;

/** @var View $view */

?>

<?php if ($view->supportsLabel()) { ?>
    <div class="mb-3 row">
        <?php if ($view->supportsLabel()) { ?>
            <label class="col-sm-4 col-form-label" for="<?php echo $view->getControlID() ?>">
                <?php echo $view->getLabel() ?>
            </label>
        <?php } ?>

        <?php if ($view->isRequired()) { ?>
            <span class="text-muted small">
            <?php echo t('Required') ?>
        </span>
        <?php } ?>

        <div class="col-sm-8">
            <?php $view->renderControl() ?>
        </div>
    </div>
<?php } else { ?>
    <?php if ($view->isRequired()) { ?>
        <span class="text-muted small">
            <?php echo t('Required') ?>
        </span>
    <?php } ?>

    <?php $view->renderControl() ?>
<?php } ?>


