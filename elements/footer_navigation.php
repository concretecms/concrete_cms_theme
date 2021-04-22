<?php

defined('C5_EXECUTE') or die('Access Denied.');

use Concrete\Core\Support\Facade\Application;
use Concrete\Core\Utility\Service\Identifier;

/**
 * @var $navigation \Concrete\Core\Navigation\Navigation
 */
$items = $navigation->getItems();

$app = Application::getFacadeApplication();
/** @var Identifier $idHelper */
$idHelper = $app->make(Identifier::class);
?>

<div class="row">
    <?php foreach ($items as $item) { ?>
        <div class="col-md">
            <div class="footer-navigation">
                <div class="d-none d-md-block">
                    <ul class="list-unstyled">
                        <h4 class="page-title">
                            <?= $item->getName() ?>
                        </h4>

                        <?php foreach ($item->getChildren() as $child) { ?>

                            <li>
                                <a href="<?= $child->getUrl() ?>"
                                   target="_self">
                                    <?= h($child->getName()) ?>
                                </a>
                            </li>
                        <?php } ?>
                    </ul>
                </div>
            </div>
        </div>
    <?php } ?>
</div>

<div class="row">
    <?php foreach ($items as $item) { ?>
        <div class="col-md">
            <div class="footer-navigation">
                <?php $id = "ccm-accordion-" . $idHelper->getString(); ?>

                <div class="block d-md-none">
                    <h4 data-toggle="collapse" href="#<?php echo $id; ?>"
                        role="button" aria-expanded="false"
                        aria-controls="<?php echo $id; ?>" class="page-title">
                        <?php echo $item->getName(); ?>
                    </h4>

                    <ul id="<?php echo $id; ?>" class="list-unstyled collapse multi-collapse" data-parent="footer">
                        <?php foreach ($item->getChildren() as $child) { ?>
                            <li>
                                <a href="<?= $child->getUrl() ?>"
                                   target="_self">
                                    <?= h($child->getName()) ?>
                                </a>
                            </li>
                        <?php } ?>
                    </ul>
                </div>
            </div>
        </div>
    <?php } ?>
</div>